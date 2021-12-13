const mongoose = require('mongoose')
const path = require('path')

const ImageBasePath = 'uploads/students'

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    rollNo: {
        type: String,
        required: true
    },    
    DOB: {
        type: Date,
        required: true
    },
    monthlyFee: {
        type: Number,
        required: true
    },    
    admissionFee: {
        type: Number,
        required: true
    },    
    annualCharges: {
        type: Number
    },
    stationaryCharges: {
        type: Number
    },
    admissionDate: {
        type: Date,
        required: true
    },
    phone1: {
        type: Number,
        required: true
    },
    phone2: {
        type: Number
    },
    ImageName: {
        type: String
    },
    address: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }

})

studentSchema.virtual('ImagePath').get(function() {
    if (this.ImageName != null){
        return path.join('/', ImageBasePath, this.ImageName)
    }
})

module.exports = mongoose.model('Student', studentSchema)
module.exports.ImageBasePath = ImageBasePath