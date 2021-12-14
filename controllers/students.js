const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const Student = require('../models/student')
const uploadPath = path.join('public', Student.ImageBasePath)
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// Get All
router.get('/', async (req, res) => {
    //res.send("All Students")
    let query = Student.find()    
    if (req.query.name != null && req.query.name !== ''){
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    if (req.query.fatherName != null && req.query.fatherName !== ''){
        query = query.regex('fatherName', new RegExp(req.query.fatherName, 'i'))
    }    
    if (req.query.DOB != null && req.query.DOB !== ''){
        query = query.equals('DOB', req.query.DOB)
    }
    if (req.query.rollNo != null && req.query.rollNo !== ''){
        query = query.regex('rollNo', new RegExp(req.query.rollNo, 'i'))
    }
    
    try {
        const students = await query.exec()
        res.render('students/index', { 
            students: students, 
            searchOptions: req.query 
        })
    } catch {
        res.redirect('/')
    }    
})

// New Student form
router.get('/new', async (req, res) => {
    renderFormPage(res, new Student(), 'new')
})

// Create new Student
router.post('/', upload.single('image'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const student = new Student({
        name: req.body.name,
        fatherName: req.body.fatherName,
        rollNo: req.body.rollNo,
        DOB: new Date(req.body.DOB),
        monthlyFee: req.body.monthlyFee,
        admissionFee: req.body.admissionFee,
        annualCharges: req.body.annualCharges,
        stationaryCharges: req.body.stationaryCharges,
        admissionDate: new Date(req.body.admissionDate),
        phone1: req.body.phone1,
        phone2: req.body.phone2,
        ImageName: fileName,
        address: req.body.address       
        
    })
    
    try {
        const newStudent = await student.save()
        res.redirect(`students/${newStudent.id}`)        
    } catch {
        if (student.ImageName != null) {
            removeStudentImage(student.ImageName)
        }
        renderFormPage(res, student, 'new', true)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
        res.render('students/show', { student: student })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
        renderFormPage(res, student, 'edit')
    } catch {
        res.redirect('/')
    }
})

// Update Student
router.put('/:id', upload.single('image'), async (req, res) => {
    let student
    
    try {
        student = await Student.findById(req.params.id)
                
        student.name = req.body.name
        student.fatherName = req.body.fatherName
        student.rollNo = req.body.rollNo
        student.DOB = new Date(req.body.DOB)
        student.monthlyFee = req.body.monthlyFee
        student.admissionFee = req.body.admissionFee
        student.annualCharges = req.body.annualCharges
        student.stationaryCharges = req.body.stationaryCharges
        student.admissionDate = new Date(req.body.admissionDate)
        student.phone1 = req.body.phone1
        student.phone2 = req.body.phone2
        student.ImageName = fileName
        student.address = req.body.address

        await student.save()
        res.redirect(`/students/${student.id}`)
    } catch {
        if (student != null) {
            renderFormPage(res, student, 'edit', true)
        } else {
            res.redirect('/')
        }        
    }
})

router.delete('/:id', async (req, res) => {
    let student
    try {
        student = await student.findById(req.params.id)
        student.remove()
        res.redirect('/students')        
    } catch {
        if (student != null) {
            res.render('students/show', { 
                student: student,
                errorMessage: 'Error deleting Student' 
            })
        } else {
            res.redirect('/')
        }        
    }
})

function removeStudentImage(fileName)
{
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

async function renderFormPage(res, student, form, hasError = false) {
    try
    {
        const params = {
            student: student
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error updating Student'
            } else {
                params.errorMessage = 'Error Creating Student'
            }
        }
        res.render(`students/${form}`, params)
    } catch {
        res.redirect('students')
    }
}

module.exports = router