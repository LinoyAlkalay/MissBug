const fs = require('fs')
var bugs = require('../data/bug.json')

const PAGE_SIZE = 3

module.exports = {
    query,
    get,
    remove,
    save,
    getByUserId
}

function query(filterAndSortBy) {
    const { txt, minSeverity, pageIdx, createdAt, description } = filterAndSortBy
    let filteredBugs = bugs

    if (createdAt !== undefined) {
        filteredBugs.sort((c1, c2) => (c1.createdAt - c2.createdAt) * createdAt)
    }
    if (description !== undefined) {
        filteredBugs.sort((c1, c2) => c1.description.localeCompare(c2.description) * description)
    }

    if (txt) {
        const regex = new RegExp(txt, 'i')
        filteredBugs = filteredBugs.filter(bug => regex.test(bug.title) || regex.test(bug.description) || bug.labels.some(label => regex.test(label)))
    }
    if (minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= minSeverity)
    }

    if (pageIdx !== undefined) {
        const startIdx = pageIdx * PAGE_SIZE
        filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve(filteredBugs)
}

function get(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug not found')
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No Such Bug')
    const bug = bugs[idx]
    if (bug.owner._id !== loggedinUser._id) return Promise.reject('Not your Bug')
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)
        const { title, description, severity, owner } = bug
        if (!bugToUpdate) return Promise.reject('No such Bug')
        if (owner._id !== loggedinUser._id) return Promise.reject('Not your Bug')

        bugToUpdate.title = title
        bugToUpdate.description = description
        bugToUpdate.severity = severity
    } else {
        bug._id = _makeId()
        bug.owner = loggedinUser
        bugs.push(bug)
    }
    return _writeBugsToFile()
        .then(() => bug)
}

function getByUserId(userId) {
    let userBugs = bugs.filter(bug => bug.creator._id === userId)
    return Promise.resolve(userBugs)
}

function _makeId(length = 5) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function _writeBugsToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return rej(err)
            res()
        })
    })
}