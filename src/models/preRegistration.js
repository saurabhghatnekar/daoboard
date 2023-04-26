const mongoose = require('mongoose');

const preRegistrationSchema = new mongoose.Schema({
        email: {
            type: String,
            // unique: true,
        },
        fullName: {
            type: String,
            default: ""
        },
        about: {
            type: String,
            default: ""
        },
        employer: {
            type: String,
            default: ""
        },
        companyWebsite: {
            type: String,
            default: ""
        },
        jobTitle: {
            type: String,
            default: ""
        },
        interests: {
            type: Array,
            default: []
        },
        skills: {
            type: Array,
            default: []
        },
        education: {
            type: String,

        },
        graduationYear: {
            type: String,
            default: ""
        },
        pfp: {
            type: String,
            default: ""
        },
        twitter: {
            type: String,
            default: ""
        },
        linkedIn: {
            type: String,
            default: ""
        },
        github: {
            type: String,
        },
        website: {
            type: String,
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('PreRegistration', preRegistrationSchema);