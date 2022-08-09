const mongoose = require('mongoose');
require('mongoose-type-email');
require('mongoose-type-url');


const roles = [
        "Engineering",
        "Product",
        "Design",
        "Investing",
        "Operations",
        "SalesAndMarketing"

]

const experience = [
    "lessOneYear",
    "Oneyear",
    "Twoyears",
    "Threeyears",
    "Fouryears",
    "Fiveyears",
    "Sixyears",
    "Sevenyears",
    "moreEightYears"
]

const accountTypes = [
    "JobSeeker",
    "Recruiter"
]

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
            type: String,
            enum: accountTypes
        }],
        appliedTo: [{
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

        pfp: {
            type: String
        },
        currentRole: {
            type: String,
            enum: roles,
            // required: true
        },
        experience: {
            type: String,
            enum: experience,
            // required: true
        },
        openToRoles: [{
            type: String,
            enum: roles
        }],
        bio: {
            type: String,
            maxLength: 280
        },

        role: {
            type: String,
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


        skills: [{
            type: String,
        }],


        resume: {
            type: String
        },


        status: {
            type: String,
            enum: ['Looking', 'Open', 'Closed']
        },


        jobType: [{
            type: String,
            enum: ['FullTime', 'PartTime', 'Intern', 'Cofounder', 'CXO']
        }],


        lookingFor: {
            type: String,
            maxLength: 280
        },

        uploads: [{
            type: String,

        }],

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

        shortlistedCandidates: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],

        rejectedCandidates: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],


        //candiate fields

        applied: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobPosting'
        }],

        recruitersOfApplied: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],

        rejected: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobPosting'
        }],

        withdrawn: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobPosting'
        }],


    }
);

module.exports = mongoose.model('User', userSchema);