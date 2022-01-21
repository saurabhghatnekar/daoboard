const { gql } = require('apollo-server-express');

module.exports = gql`
scalar Upload
scalar Date
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
    accountType: [AccountType]

    """
    About
    """

    firstName: String!
    lastName: String!
    ens: String
    pfp: File
    currentRole: Role!
    experience: Experience!
    openToRoles: [Role!]!
    bio: String

    """
    Social profiles
    """

    website: String
    linkedIn: String
    github: String
    twitter: String

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

    """
    Recruiter fields
    """
    company: Company!
    isFounder: Boolean!
    jobPostings: [JobPosting]!

}


type Company {
    id: ID!
    name: String!
    logo: File
    type: companyType!
    website: String
    linkedIn: String
    github: String
    twitter: String
    markets: [String]!
    elevatorPitch: String!
    whyYourCompany: String!
    recruiters: [User!]!
    founders: [User]!
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
    hiringContact: User!
    applied: [User]!
}

type Query {
    uploads: [File]
    users: [User]!
    companies: [Company]!
    jobPostings: [JobPosting]!

    """
    User queries
    """
    me: User!
    company: Company!
    myPostings: [JobPosting]!
    jobPostingsByCompany: [JobPosting]!
    jobPostingsByRole: [JobPosting]!
    jobPostingsByJobType: [JobPosting]!
    jobPostingsByCompanyType: [JobPosting]!

    """
    Recruiter queries
    """
    RecruiterPostings: [JobPosting]!
    UsersByCurrentRole: [User]!
    UsersByOpenToRoles: [User]!
    UsersByJobType: [User]!
    UsersByExperience: [User]!

}

type Mutation {
    singleUpload(file: Upload!): File!
    signUp(email: Email!, password: String!): String!
    signIn(email: Email!, password: String!): String!

    updateProfile(
        field: String!
        stringValue: String
        stringsValue: [String]
        accountTypesValue: [AccountType]
        roleValue: Role
        rolesValue: [Role]
        statusValue: Status
        jobTypesValue: [JobType]
        experienceValue: Experience
        booleanValue: Boolean
    ): User!

    updatePFP(pfp: Upload!): User!
    updateResume(pfp: Upload!): User!

    createJobExperience(
        company: String!,
        title: String!,
        startDate: Date!,
        endDate: Date!,
        description: String!
        positionType: jobExperienceType!
    ): JobExperience!
    updateJobExperience(
        id: ID!
        field: String!
        stringValue: String
        dateValue: Date
        jobExperienceTypeValue: jobExperienceType
    ): JobExperience!

    createEducation(
        college: String!,
        graduation: Date,
        degreeType: DegreeType,
        major: String,
        gpa: Float,
        gpaMax: Float
    ): Education!
    updateEducation(
        id: ID!
        field: String!
        stringValue: String
        floatValue: Float
        degreeTypeValue: DegreeType
        dateValue: Date
    ): Education!


}


type File {
    filename: String!
    mimetype: String!
    encoding: String!
}

type JobExperience {
    id: ID!
    company: String!
    title: String!
    startDate: Date!
    endDate: Date!
    description: String
    positionType: jobExperienceType!
    user: User!
}

type Education {
    id: ID!
    college: String!
    graduation: Date
    degreeType: DegreeType
    major: String
    gpa: Float
    gpaMax: Float
    user: User!
}

enum AccountType {
    JobSeeker
    Recruiter
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
