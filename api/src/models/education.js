const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
    {
        school: {
            type: String
        },
        graduation: {
            type: Date
        },
        DegreeType: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }

    }
)

module.exports = mongoose.model('Education', educationSchema);