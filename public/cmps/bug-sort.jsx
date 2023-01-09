const { useState, useEffect } = React

import { bugService } from "../services/bug.service.js"

export function BugSort({ onSetSort }) {
    const [sortBy, setSortBy] = useState(bugService.getDefaultSort())

    useEffect(() => {
        onSetSort(sortBy)
    }, [sortBy])

    function handleChange({ target }) {
        let { value } = target
        setSortBy((prevSort) => {
            prevSort[value] = prevSort[value] === 1 ? -1 : 1
            return { ...prevSort, [value]: prevSort[value] }
        })
    }

    return <section className="bug-sort">
        <select name="sort-by" onChange={handleChange}>
            <option value="">Sort by</option>
            <option value="createdAt">date</option>
            <option value="description">details</option>
        </select>
    </section>

}