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

const jobPostingSchema = new mongoose.Schema(
    {
        about: {
            type: String,
            maxLength: 4000,
            required: true
        },
        jobType: {
            type: String,
            enum: roles,
            required: true
        },
        experienceRequired: {
            type: String,
            enum: experience,
            required: true
        },
        skillsRequired: [{
            type: String
        }],
        hiringContact: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recruiter'
        }],

        
    }
);

module.exports = mongoose.model('JobPosting', jobPostingSchema);