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
        degreeType: {
            type: String,
            enum: degreeTypes,
        },
        major: {
            type: String,
        },
        gpa: {
            type: Number
        },
        gpaMax: {
            type: Number
        },

    }
)

module.exports = mongoose.model('Education', educationSchema);