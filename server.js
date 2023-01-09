const express = require('express')
const cookieParser = require('cookie-parser')
const bugService = require('./services/bug.service.js')
const userService = require('./services/user.service.js')

const app = express()

const IS_PREMIUM = false
const COOKIE_AGE = 1000 * 7

// App configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// * Bug API * //
// List
app.get('/api/bug', (req, res) => {
    const filterAndSortBy = req.query
    bugService.query(filterAndSortBy)
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Update
app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update Bug')

    const bug = req.body
    bugService.save(bug, loggedinUser)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot update bug')
        })
})

// Create
app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add Bug')

    const bug = req.body
    bugService.save(bug, loggedinUser)
        .then((savedBug) => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot create bug')
        })
})

// Read
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    console.log('bugId:', bugId)

    let visitedCountIds = req.cookies.visitedCountIds || []
    if (!visitedCountIds.includes(bugId)) {
        if (visitedCountIds.length >= 3 && !IS_PREMIUM) {
            return res.status(401).send('Wait for a bit')
        }
        visitedCountIds.push(bugId)
    }

    bugService.get(bugId)
        .then(bug => {
            res.cookie('visitedCountIds', visitedCountIds, { maxAge: COOKIE_AGE })
            res.send(bug)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get bug')
        })
})

// Remove
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot delete Bug')

    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
        .then(() => {
            res.send({ msg: 'Bug removed successfully', bugId })
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot delete bug')
        })
})

// * User API * //
// List
app.get('/api/auth', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get users')
        })
})

app.get('/api/auth/:userId', (req, res) => {
    const { userId } = req.params
    console.log('userId:', userId)
    userService.get(userId)
        .then((user) => {
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get user')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.login(credentials)
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot login')
        })
})

app.post('/api/auth/signup', (req, res) => {
    const { fullname, username, password } = req.body
    userService.signup({ fullname, username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

// user list
app.get('/api/bug/auth/:userId', (req, res) => {
    const { userId } = req.params

    bugService.getByUserId(userId)
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Listen will always be the last line in our server!
app.listen(3030, () => console.log('Server ready at port 3030!'))