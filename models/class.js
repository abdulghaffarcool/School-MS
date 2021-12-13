const mongoose = require('mongoose')
//const Book = require('./book')

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true
    },
    description: {
        type: String        
    }
})

// classSchema.pre('remove', function(next) {
//     Book.find({ class: this.id }, (err, books) => {
//         if (err){
//             next(err)
//         } else if (books.length > 0) {
//             next(new Error('This class has students'))
//         } else {
//             next()
//         }
//     })
// })

module.exports = mongoose.model('Class', classSchema)