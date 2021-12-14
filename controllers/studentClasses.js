const express = require('express')
const router = express.Router()
const StudentClass = require('../models/studentClass')
const Session = require('../models/session')
const Class = require('../models/class')
const Student = require('../models/student')

// Get All
router.get('/', async (req, res) => {
    //res.send("All StudentClasss")
    let query = StudentClass.find()    
    if (req.query.title != null && req.query.title !== ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore !== ''){
        query = query.lte('publishedDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter !== ''){
        query = query.gte('publishedDate', req.query.publishedAfter)
    }
    try {
        const studentClass = await query.exec()
        res.render('studentClass/index', { 
            studentClass: studentClass, 
            searchOptions: req.query 
        })
    } catch {
        res.redirect('/')
    }    
})

// New StudentClass form
router.get('/new', async (req, res) => {
    renderFormPage(res, new StudentClass(), 'new')
})

// Create new StudentClass
router.post('/', async (req, res) => {
    const studentClass = new StudentClass({
        studentClassTitle: req.body.studentClassTitle,
        session: req.body.session,
        class: req.body.class,
        student: req.body.student        
    })
    
    try {
        const newStudentClass = await StudentClass.save()
        res.redirect(`studentClass/${newStudentClass.id}`)        
    } catch {
        renderFormPage(res, studentClass, 'new', true)
    }
})

router.get('/:id', async (req, res) => {
    try {
        //const studentClass = await StudentClass.findById(req.params.id).populate('student').exec()
        const studentClass = await StudentClass.findById(req.params.id)
        res.render('studentClass/show', { studentClass: studentClass })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const studentClass = await StudentClass.findById(req.params.id)
        renderFormPage(res, studentClass, 'edit')
    } catch {
        res.redirect('/')
    }
})

// Update StudentClass
router.put('/:id', async (req, res) => {
    let studentClass
    
    try {
        studentClass = await StudentClass.findById(req.params.id)
        
        studentClass.studentClassTitle = req.body.studentClassTitle
        studentClass.session = req.body.session
        studentClass.class = req.body.class
        studentClass.student = req.body.student
        
        await studentClass.save()
        res.redirect(`/studentClass/${studentClass.id}`)
    } catch {
        if (studentClass != null) {
            renderFormPage(res, studentClass, 'edit', true)
        } else {
            res.redirect('/')
        }
    }
})

router.delete('/:id', async (req, res) => {
    let studentClass
    try {
        studentClass = await StudentClass.findById(req.params.id)
        studentClass.remove()
        res.redirect('/studentClass')        
    } catch {
        if (studentClass != null) {
            res.render('studentClass/show', { 
                studentClass: studentClass,
                errorMessage: 'Error deleting StudentClass' 
            })
        } else {
            res.redirect('/')
        }        
    }
})

async function renderFormPage(res, studentClass, form, hasError = false) {
    try
    {
        //const authors = await Author.find({})
        
        const params = {
            //authors: authors,
            studentClass: studentClass
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error updating StudentClass'
            } else {
                params.errorMessage = 'Error Creating StudentClass'
            }
        }        
        res.render(`studentClass/${form}`, params)
    } catch {
        res.redirect('studentClass')
    }
}

module.exports = router