const mongoose = require('mongoose');
require('mongoose-type-email');
require('mongoose-type-url');


const roles = [
    "Engineering",
    "Product",
    "Design",
    "Investing",
    "Operations",
    "Sales and Marketing"
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

const jobPostingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            maxLength: 4000,
            required: true
        },
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
            enum: roles,
            required: true
        }],
        jobType: {
            type: String,
            enum: ['FullTime', 'PartTime', 'Intern', 'Cofounder']
        },
        experienceRequired: {
            type: String,
            enum: experience,
        },
        skillsRequired: [{
            type: String
        }],
        hiringContact: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        applied: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],


    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('JobPosting', jobPostingSchema);