const express = require('express')
const router = express.Router()
const Class = require('../models/class')

// Get All and Search
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.className != null && req.query.className !== ''){
        searchOptions.className = new RegExp(req.query.className, 'i')
    }
    try {
        const classes = await Class.find(searchOptions)
        res.render('classes/index', { 
            classes: classes, 
            searchOptions: req.query 
        })
    } catch {
        res.redirect('/')
    }    
})

// New Class form
router.get('/new', (req, res) => {
    res.render('classes/new', { classs: new Class() })
})

// Create new Class
router.post('/', async (req, res) => {
    //console.log("ddd")
    const classs = new Class({
        className: req.body.className,
        description: req.body.description
    })
    try {
        const newClass = await classs.save()
        // res.redirect(`classes/${newClass.id}`)
        res.redirect('classes')
    } catch {
        res.render('classes/new', {
            classs: classs,
            errorMessage: 'Error Creating Class'
        })
    }    
    //res.send(req.body.name)
})

// Get Class by Id
router.get('/:id', async (req, res) => {
    try {
        const classs = await Class.findById(req.params.id)
        res.render('classes/show', {
            classs: classs
        })
    } catch {
        res.redirect('/')
    }
})

// Edit Class Form
router.get('/:id/edit', async (req, res) => {
    try{
        const classs = await Class.findById(req.params.id)
        res.render('classes/edit', { classs: classs })
    } catch {
        res.redirect('/classes')
    }
})

// Edit class update
router.put('/:id', async (req, res) => {
    let classs
    try {
        classs = await Class.findById(req.params.id)
        classs.className = req.body.className
        classs.description = req.body.description
        await classs.save()
        res.redirect(`/classes/${classs.id}`)        
    } catch {
        if (classs == null) {
            res.redirect('/')
        } else {
            res.render('classes/edit', {
                classs: classs,
                errorMessage: 'Error Updating Class'
            })
        }        
    }
})

router.delete('/:id', async (req, res) => {
    let classs
    try {
        classs = await Class.findById(req.params.id)
        await classs.remove()
        res.redirect('classes/')        
    } catch (err){
        console.log(err)
        if (classs == null) {
            res.redirect('/')
        } else {
            res.redirect(`/classes/${classs.id}`)
        }        
    }
})

module.exports = router