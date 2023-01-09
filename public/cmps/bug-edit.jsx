const { useState, useEffect, useRef, Fragment } = React
const { useParams, Link } = ReactRouterDOM

import { bugService } from "../services/bug.service.js"

export function BugEdit() {
    const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())
    const { bugId } = useParams()

    useEffect(() => {
        if (!bugId) return
        loadBug()
    }, [])

    function loadBug() {
        bugService.get(bugId)
            .then((bug) => setBugToEdit(bug))
            .catch((err) => {
                console.log('Had issues in bug details', err)
            })
    }

    function handleChange({ target }) {
        let { value, type, name: field } = target
        value = type === 'number' ? +value : value
        setBugToEdit((prevBug) => ({ ...prevBug, [field]: value }))
    }

    function onEditBug() {
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

    return <section className="bug-edit">
        <h2>{bugToEdit.id ? 'Edit this bug' : 'Add a new bug'}</h2>
        <form onSubmit={onEditBug}>
            <input type="text"
                name="title"
                placeholder="Enter title..."
                value={bugToEdit.title}
                onChange={handleChange}
            />
            <input type="text"
                name="description"
                placeholder="Enter description..."
                value={bugToEdit.description}
                onChange={handleChange}
            />
            <input type="number"
                name="severity"
                placeholder="Enter severity..."
                value={bugToEdit.severity}
                onChange={handleChange}
            />
            {/* <input type="text"
                name="labels"
                placeholder="Enter labels..."
                value={bugToEdit.labels}
                onChange={handleChange}
            /> */}
            <div>
                <button>{bugToEdit._id ? 'Save' : 'Add'}</button>
                <Link to="/bug">Cancel</Link>
            </div>
        </form>
    </section>
}