const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')

// Get All
router.get('/', async (req, res) => {
    //res.send("All Books")
    let query = Book.find()    
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
        const books = await query.exec()
        res.render('books/index', { 
            books: books, 
            searchOptions: req.query 
        })
    } catch {
        res.redirect('/')
    }    
})

// New Book form
router.get('/new', async (req, res) => {
    renderFormPage(res, new Book(), 'new')
})

// Create new Book
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishedDate: new Date(req.body.publishedDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })
    
    try {
        const newBook = await book.save()
        res.redirect(`books/${newBook.id}`)        
    } catch {
        renderFormPage(res, book, 'new', true)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', { book: book })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderFormPage(res, book, 'edit')
    } catch {
        res.redirect('/')
    }
})

// Update Book
router.put('/:id', async (req, res) => {
    let book
    
    try {
        book = await book.findById(req.params.id)
        
        book.title = req.body.title
        book.author = req.body.author
        book.publishedDate = new Date(req.body.publishedDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch {
        if (book != null) {
            renderFormPage(res, book, 'edit', true)
        } else {
            res.redirect('/')
        }        
    }
})

router.delete('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        book.remove()
        res.redirect('/books')        
    } catch {
        if (book != null) {
            res.render('books/show', { 
                book: book,
                errorMessage: 'Error deleting book' 
            })
        } else {
            res.redirect('/')
        }        
    }
})

async function renderFormPage(res, book, form, hasError = false) {
    try
    {
        const authors = await Author.find({})
        //const book = new Book()
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error updating Book'
            } else {
                params.errorMessage = 'Error Creating Book'
            }
        }        
        res.render(`books/${form}`, params)
    } catch {
        res.redirect('books')
    }
}

module.exports = router