const express = require('express')
const router = express.Router()
const Session = require('../models/session')

// Get All
router.get('/', async (req, res) => {
    //res.send("All sessions")
    let query = Session.find()    
    if (req.query.sessionName != null && req.query.sessionName !== ''){
        query = query.regex('sessionName', new RegExp(req.query.sessionName, 'i'))
    }
    if (req.query.startDate != null && req.query.startDate !== ''){
        query = query.gte('startDate', req.query.startDate)
    }
    if (req.query.endDate != null && req.query.endDate !== ''){
        query = query.lte('endDate', req.query.endDate)
    }
    try {
        const sessions = await query.exec()
        res.render('sessions/index', { 
            sessions: sessions, 
            searchOptions: req.query 
        })
    } catch {
        res.redirect('/')
    }    
})

// New Session form
router.get('/new', async (req, res) => {
    renderFormPage(res, new Session(), 'new')
})

// Create new Session
router.post('/', async (req, res) => {
    const session = new Session({
        sessionName: req.body.sessionName,
        description: req.body.description,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate)        
    })
    
    try {
        const newSession = await session.save()
        res.redirect(`sessions/${newSession.id}`)     
    } catch {        
        renderFormPage(res, session, 'new', true)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
        res.render('sessions/show', { session: session })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
        renderFormPage(res, session, 'edit')
    } catch {
        res.redirect('/')
    }
})

// Update Session
router.put('/:id', async (req, res) => {
    let session
    
    try {
        session = await Session.findById(req.params.id)
        
        session.sessionName = req.body.sessionName
        session.description = req.body.description
        session.startDate = new Date(req.body.startDate)
        session.endDate = new Date(req.body.endDate)
                
        await session.save()
        res.redirect(`/sessions/${session.id}`)
    } catch {
        if (session != null) {
            renderFormPage(res, session, 'edit', true)
        } else {
            res.redirect('/')
        }        
    }
})

router.delete('/:id', async (req, res) => {
    let session
    try {
        session = await Session.findById(req.params.id)
        session.remove()
        res.redirect('/sessions')        
    } catch {
        if (session != null) {
            res.render('sessions/show', { 
                session: session,
                errorMessage: 'Error deleting session' 
            })
        } else {
            res.redirect('/')
        }        
    }
})

async function renderFormPage(res, session, form, hasError = false) {
    try
    {        
        //const session = new Session()
        const params = {
            session: session
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error updating Session'
            } else {
                params.errorMessage = 'Error Creating Session'
            }
        }
        res.render(`sessions/${form}`, params)
    } catch {
        res.redirect('sessions')
    }
}

module.exports = router