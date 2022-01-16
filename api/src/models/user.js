const mongoose = require('mongoose');
require('mongoose-type-email');
require('mongoose-type-url');


const roles = [
    "SoftwareEngineer",
    "MobileDeveloper",
    "AndroidDeveloper",
    "iOSDeveloper",
    "FrontendEngineer",
    "BackendEngineer",
    "FullStackEngineer",
    "SoftwareArchitect",
    "SecurityEngineer",
    "MachineLearningEngineer",
    "EmbeddedEngineer",
    "DataEngineer",
    "DevOps",
    "EngineeringManager",
    "QAEngineer",
    "DataScientist",
    "UIUXDesigner",
    "UserResearcher",
    "VisualDesigner",
    "CreativeDirector",
    "DesignManager",
    "GraphicDesigner",
    "ProductDesigner",
    "ProductManager",
    "FinanceAccounting",
    "HR",
    "OfficeManager",
    "Recruiter",
    "CustomerService",
    "OperationsManager",
    "ChiefOfStaff",
    "BusinessDevelopmentRepresentative",
    "SalesDevelopmentRepresentative",
    "AccountExecutive",
    "BusinessDevelopmentManager",
    "AccountManager",
    "SalesManager",
    "CustomerSuccessManager",
    "GrowthHacker",
    "MarketingManager",
    "ContentCreator",
    "DigitalMarketingManager",
    "ProductMarketingManager",
    "Copywriter",
    "SocialMediaManager",
    "CEO",
    "CFO",
    "CMO",
    "COO",
    "CTO",
    "HardwareEngineer",
    "MechanicalEngineer",
    "SystemsEngineer",
    "BusinessAnalyst",
    "ProjectManager",
    "Attorney",
    "DataAnalyst"
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

const userSchema = new mongoose.Schema(
    {
        email: {
            type: mongoose.SchemaTypes.Email,
            required: true
        },
        password: {
            type: String,
            required: true
        },
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
        ens: {
            type: String,
        },
        pfp: {
            type: Buffer
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
            type: Buffer
        },


        status: {
            type: String,
            enum: ['Looking', 'Open', 'Closed']
        },


        jobType: [{
            type: String,
            enum: ['FullTime', 'PartTime', 'Intern', 'Cofounder']
        }],


        lookingForWebThree: {
            type: String,
            maxLength: 280
        }


    }
);

module.exports = mongoose.model('User', userSchema);