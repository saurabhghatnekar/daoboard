const mongoose = require('mongoose');

degreeTypes = [
    "Associate",
    "Bachelor",
    "Engineer",
    "Master",
    "JD",
    "MBA",
    "PhD",
    "MD",
    "HighSchool",
    "NonDegreeProgram",
    "Other",
]

const educationSchema = new mongoose.Schema(
    {
        college: {
            type: String,
            required: true
        },
        graduation: {
            type: Date
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }

    }
)

module.exports = mongoose.model('Education', educationSchema);