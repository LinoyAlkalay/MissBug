const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { BugList } from '../cmps/bug-list.jsx'

import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function UserDetails() {
    const { userId } = useParams()
    const navigate = useNavigate()
    const [bugs, setBugs] = useState([])

    useEffect(() => {
        loadUserBugs()
    }, [])

    function loadUserBugs() {
        bugService.getByUserId(userId)
            .then(setBugs)
            .catch((err) => {
                console.log('Had issues in bugs user details', err)
                showErrorMsg('Cannot load user bugs')
                navigate('/bug')
            })
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

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService.save(bugToSave)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map(currBug => (currBug._id === savedBug._id) ? savedBug : currBug)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    return <section className="user-details main-layout">
        <h2>Look at all the bugs you've created!</h2>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
    </section>
}