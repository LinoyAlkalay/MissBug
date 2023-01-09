const { useState, useEffect } = React

import { bugService } from "../services/bug.service.js"

export function BugFilter({ onSetFilter }) {
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        onSetFilter(filterBy)
    }, [filterBy])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = (type === 'number') ? +value : value
        if(field === 'pageIdx') value--
        setFilterBy((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterBy)
    }

    return <section className="bug-filter">
        <form onSubmit={onSubmitFilter}>
            <input type="text"
                name="txt"
                placeholder="Search: label, title..."
                value={filterBy.txt}
                onChange={handleChange}
            />
            <input type="number"
                name="minSeverity"
                placeholder="Minimum severity"
                onChange={handleChange}
            />
            <input type="number"
                name="pageIdx"
                placeholder="Page"
                onChange={handleChange}
            />
            <button>Filter bugs!</button>
        </form>

    </section>
}