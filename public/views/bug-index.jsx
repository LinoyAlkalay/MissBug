const { useState, useEffect, Fragment } = React
const { Link } = ReactRouterDOM

import { BugList } from '../cmps/bug-list.jsx'
import { BugFilter } from '../cmps/bug-filter.jsx'
import { BugSort } from '../cmps/bug-sort.jsx'
import { LoginSignup } from '../cmps/login-signup.jsx'

import { bugService } from '../services/bug.service.js'
import { userService } from '../services/user.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [sortBy, setSortBy] = useState(bugService.getDefaultSort())
    const [user, setUser] = useState(userService.getLoggedinUser())

    useEffect(() => {
        loadBugs()
    }, [filterBy, sortBy])

    function loadBugs() {
        bugService.query(filterBy, sortBy)
            .then(setBugs)
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            description: prompt('Bug description?'),
            severity: +prompt('Bug severity?')
        }

        bugService.save(bug)
            .then(savedBug => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onSetFilter(filterBy) {
        setFilterBy(filterBy)
    }

    function onSetSort(sortBy) {
        setSortBy(sortBy)
    }

    // function onEditBug(bug) {
    //     const severity = +prompt('New severity?')
    //     const bugToSave = { ...bug, severity }
    //     bugService.save(bugToSave)
    //         .then(savedBug => {
    //             console.log('Updated Bug:', savedBug)
    //             const bugsToUpdate = bugs.map(currBug => (currBug._id === savedBug._id) ? savedBug : currBug)
    //             setBugs(bugsToUpdate)
    //             showSuccessMsg('Bug updated')
    //         })
    //         .catch(err => {
    //             console.log('Error from onEditBug ->', err)
    //             showErrorMsg('Cannot update bug')
    //         })
    // }

    function onChangeLoginStatus(user) {
        setUser(user)
    }

    function onLogout() {
        userService.logout()
            .then(() => {
                setUser(null)
            })
    }

    return <Fragment>
        <section className="login-container main-layout">
            {
                user ? (
                    <section className="login-signup">
                        <div className="login-signup-container">
                            <Link to={`/bug/auth/${user._id}`}>
                                <img src="../assets/imgs/female_avatar.svg" alt="" />
                            </Link>
                            <h2>Hello {user.fullname}</h2>
                        </div>
                        <button onClick={onLogout}>Logout</button>
                    </section>
                ) : (
                    <section className="login-form">
                        <LoginSignup onChangeLoginStatus={onChangeLoginStatus} />
                    </section>
                )
            }
        </section>
        <main className="bug-index main-layout">
            <main>
                <img src="../assets/imgs/bug_fixing.svg" alt="" />
                <div className="bug-index-edit-area">
                    <button onClick={onAddBug}>Add Bug</button>
                    <BugFilter onSetFilter={onSetFilter} />
                </div>
                <BugSort onSetSort={onSetSort} />
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
                {/* <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} /> */}
            </main>
        </main>
    </Fragment>
}
