const mongoose = require('mongoose');

const jobExperienceSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            // required: true
        },
        title: {
            type: String,
            // required: true
        },
        startDate: {
            type: Date,
            // required: true
        },
        endDate: {
            type: Date,
            // required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }

    }
)

module.exports = mongoose.model('JobExperience', jobExperienceSchema);