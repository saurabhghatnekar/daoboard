const mongoose = require('mongoose');
require('mongoose-type-email');
require('mongoose-type-url');

const jobPostingSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        title: {
            type: String
        },
        about: {
            type: String,
            maxLength: 4000
        },
        roles: [{
            type: String
        }],
        jobType: {
            type: String
        },
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }

        
    }
);

module.exports = mongoose.model('JobPosting', jobPostingSchema);