const mongoose = require('mongoose');
require('mongoose-type-email');
require('mongoose-type-url');

const jobPostingSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        about: {
            type: String,
            maxLength: 4000,
            required: true
        },
        roles: [{
            type: String,
            required: true
        }],
        jobType: {
            type: String
        },
        experienceRequired: {
            type: String
        },
        skillsRequired: [{
            type: String
        }],
        hiringContact: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recruiter'
        }],
        applied: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],

        
    }
);

module.exports = mongoose.model('JobPosting', jobPostingSchema);