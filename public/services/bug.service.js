const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getByUserId,
    getById,
    save,
    remove,
    getDefaultFilter,
    getDefaultSort,
    getEmptyBug
}

function query(filterBy = getDefaultFilter(), sortBy = getDefaultSort()) {
    const { txt, minSeverity, pageIdx } = filterBy
    const { createdAt, description } = sortBy
    let queryParams = `?txt=${txt}&minSeverity=${minSeverity}&pageIdx=${pageIdx}&createdAt=${createdAt}&description=${description}`
    return axios.get(BASE_URL + queryParams)
        .then(res => res.data)
}

function getByUserId(userId) {
    return axios.get(BASE_URL + 'auth/' + userId)
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
}

function save(bug) {
    if (bug._id) return axios.put(BASE_URL + bug._id, bug)
        .then(res => res.data)
    return axios.post(BASE_URL, bug)
        .then(res => res.data)
}

function getDefaultFilter() {
    return { txt: '', minSeverity: 0, pageIdx: 0, creatorId: '' }
}

function getDefaultSort() {
    return { createdAt: 1, description: 1 }
}

function getEmptyBug() {
    return { title: '', description: '', severity: 0, createdAt: 0, labels: [] }
}
