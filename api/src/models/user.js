const mongoose = require('mongoose');
require('mongoose-type-email');
require('mongoose-type-url');


const userSchema = new mongoose.Schema(
    {
        email: {
            type: mongoose.SchemaTypes.Email,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        accountType: [{
            type: String
        }],
        matchedTo: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        matchedFrom: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        matches: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        rejectedJobs: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobPosting'
        }],


        firstName: {
            type: String,
            // required: true
        },
        lastName: {
            type: String,
            // required: true
        },
        ens: {
            type: String,
            unique: true
        },
        publicKey: {
            type: String,
            unique: true
        },
        pfp: {
            type: Buffer
        },
        currentRole: {
            type: String
            // required: true
        },
        openToRoles: [{
            type: String
        }],
        bio: {
            type: String,
            maxLength: 280
        },


        website: {
            type: mongoose.SchemaTypes.Url
        },
        linkedIn: {
            type: mongoose.SchemaTypes.Url
        },
        github: {
            type: mongoose.SchemaTypes.Url
        },
        twitter: {
            type: mongoose.SchemaTypes.Url
        },


        jobExperience: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobExperience'
        }],


        education: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Education'
        }],


        status: {
            type: String
        },


        hereTo: [{
            type: String
        }],


        lookingForWebThree: {
            type: String,
            maxLength: 280
        },


        // Recruiter fields

        jobPostings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobPosting'
        }],
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        isFounder: {
            type: Boolean,
            // required: true
        },
        rejectedJobSeekers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],


    }
);

module.exports = mongoose.model('User', userSchema);