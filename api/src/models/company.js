const mongoose = require('mongoose');
require('mongoose-type-email');
require('mongoose-type-url');

const companySchema = new mongoose.Schema(
    {
        jobPostings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobPosting'
        }],
        name: {
            type: String
        },
        logo: {
            type: Buffer
        },
        type: {
            type: String
        },
        elevatorPitch: {
            type: String,
            maxLength: 280
        },
        markets: [{
            type: String
        }],
        recruiters: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
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

    }
);

module.exports = mongoose.model('Company', companySchema);