const { gql } = require('apollo-server-express');

module.exports = gql`
scalar Upload
scalar Date
scalar URL
scalar Email

type User {

    """
    Account info
    """

    id: ID!
    email: Email!
    password: String!
    appliedTo: [JobPosting]!
    publicKey: String

    """
    About
    """

    firstName: String!
    lastName: String!
    ens: String!
    pfp: File
    currentRole: Role!
    experience: Experience!
    openToRoles: [Role!]!
    bio: String

    """
    Social profiles
    """

    website: URL
    linkedIn: URL
    github: URL
    twitter: URL

    """
    Experience
    """

    jobExperience: [JobExperience]!

    """
    Education
    """

    education: [Education]!

    """
    Skills
    """

    skills: [String]!

    """
    Resume
    """

    resume: File

    """
    Status
    """

    status: Status!

    """
    Job type
    """

    jobType: [JobType!]!

    """
    What are you looking for in web3
    """

    lookingForWebThree: String!
}

type Recruiter {
    id: ID!
    firstName: String!
    lastName: String!
    email: Email!
    password: String!
    company: Company!
    isFounder: Boolean!
    role: Role
    jobPostings: [JobPosting]!
}

type Company {
    id: ID!
    name: String!
    logo: File
    type: companyType!
    website: URL
    linkedIn: URL
    github: URL
    twitter: URL
    markets: [String]!
    elevatorPitch: String!
    whyYourCompany: String!
    recruiters: [Recruiter!]!
    founders: [Recruiter]!
    jobsPostings: [JobPosting]!
}

type JobPosting {
    id: ID!
    company: Company!
    about: String
    experienceRequired: Experience
    role: [Role!]!
    jobType: JobType!
    skillsRequired: [String]!
    hiringContact: Recruiter!
    applied: [User]!
}

type Query {
    uploads: [File]
    users: [User]!
    recruiters: [Recruiter]!
    companies: [Company]!
    jobPostings: [JobPosting]!

    """
    User queries
    """
    me: User!
    company: Company!
    myPostings: [JobPosting!]
    jobPostingsByCompany: [JobPosting]!
    jobPostingsByRole: [JobPosting]!
    jobPostingsByJobType: [JobPosting]!
    jobPostingsByCompanyType: [JobPosting]!

    """
    Recruiter queries
    """
    meRecruiter: Recruiter!

}

type Mutation {
    singleUpload(file: Upload!): File!
}

type File {
    filename: String!
    mimetype: String!
    encoding: String!
}

type JobExperience {
    company: String!
    title: String!
    startDate: Date!
    endDate: Date!
    description: String
    positionType: jobExperienceType!
}

type Education {
    college: String!
    graduation: Date
    degreeType: DegreeType
    major: String
    gpa: Float
    gpaMax: Float
}

enum Role {

        """
        Engineering
        """
    
        SoftwareEngineer
        MobileDeveloper
        AndroidDeveloper
        iOSDeveloper
        FrontendEngineer
        BackendEngineer
        FullStackEngineer
        SoftwareArchitect
        SecurityEngineer
        MachineLearningEngineer
        EmbeddedEngineer
        DataEngineer
        DevOps
        EngineeringManager
        QAEngineer
        DataScientist
    
        """
        Designer
        """
    
        UIUXDesigner
        UserResearcher
        VisualDesigner
        CreativeDirector
        DesignManager
        GraphicDesigner
        ProductDesigner

        """
        Product
        """
  
        ProductManager
    
        """
        Operations
        """
    
        FinanceAccounting
        HR
        OfficeManager
        Recruiter
        CustomerService
        OperationsManager
        ChiefOfStaff

        """
        Sales
        """
 
        BusinessDevelopmentRepresentative
        SalesDevelopmentRepresentative
        AccountExecutive
        BusinessDevelopmentManager
        AccountManager
        SalesManager
        CustomerSuccessManager
    
        """
        Marketing
        """
  
        GrowthHacker
        MarketingManager
        ContentCreator
        DigitalMarketingManager
        ProductMarketingManager
        Copywriter
        SocialMediaManager
    
        """
        Management
        """
  
        CEO
        CFO
        CMO
        COO
        CTO
    
        """
        Other Engineering
        """

        HardwareEngineer
        MechanicalEngineer
        SystemsEngineer
    
        """
        Other
        """

        BusinessAnalyst
        ProjectManager
        Attorney
        DataAnalyst
    
}

enum Experience {
    lessOneYear
    Oneyear
    Twoyears
    Threeyears
    Fouryears
    Fiveyears
    Sixyears
    Sevenyears
    moreEightYears
}

enum jobExperienceType {
    Sales
    Technical
}

enum DegreeType {
    Associate
    Bachelor
    Engineer
    Master
    JD
    MBA
    PhD
    MD
    HighSchool
    NonDegreeProgram
    Other
}

enum Status {
    Looking
    Open
    Closed
}

enum JobType {
    FullTime
    PartTime
    Intern
    Cofounder
}

enum companyType {
    DAO
    CentralizedWithPlansForDAO
    CentralizedWithoutPlansForDAO
}

`;
