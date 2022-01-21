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

const recruiterSchema = new mongoose.Schema(
    {
        email: {
            type: mongoose.SchemaTypes.Email,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        jobPostings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobPosting'
        }],
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },


        firstName: {
            type: String,
            // required: true
        },
        lastName: {
            type: String,
            // required: true
        },
        role: {
            type: String,
            enum: roles,
            // required: true
        },
        isFounder: {
            type: Boolean,
            // required: true
        }


    }
);

module.exports = mongoose.model('Recruiter', recruiterSchema);