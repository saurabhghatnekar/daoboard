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
    role: String!
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
    company: Company
    isFounder: Boolean
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
    about: String!
    experienceRequired: Experience
    roles: [Role!]!
    jobType: JobType!
    skillsRequired: [String]!
    hiringContact: User!
    applied: [User]!
}

type SignInResponse {
    token: String!
    user: User!
}

type Query {
    uploads: [File]
    users(
        experience: [Experience]
        currentRoles: [Role]
        openToRoles: [Role]
        jobTypes: [JobType]
    ): [User]!
    companies: [Company]!
    jobPostings(
        companyName: String
        companyType: companyType
        roles: [Role]
        jobTypes: [JobType]
    ): [JobPosting]!

    """
    User queries
    """
    me: User!

}

type Mutation {
    singleUpload(file: Upload!): File!
    signUp(email: Email!, password: String!, firstName: String!, lastName:String!, role: String!): String!
    signIn(email: Email!, password: String!): SignInResponse!
    
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
        company: String!
        title: String!
        startDate: Date!
        endDate: Date!
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

    createCompany(
        name: String!
        type: companyType!
        website: String
        linkedIn: String
        github: String
        twitter: String
        markets: [String]!
        elevatorPitch: String!
        whyYourCompany: String!
    ): Company!
    updateCompany(
        id: ID!
        field: String!
        stringValue: String
        stringsValue: [String]
        companyTypeValue: companyType
    ): Company!

    createJobPosting(
        about: String!
        experienceRequired: Experience
        roles: [Role!]!
        jobType: JobType!
        skillsRequired: [String]!
    ): JobPosting!
    updateJobPosting(
        id: ID!
        field: String!
        stringValue: String,
        experienceValue: Experience,
        rolesValue: [Role],
        jobTypeValue: JobType,
        skillsRequiredValue: [String]
    ): JobPosting!

    applyToJob(id: ID!): JobPosting!


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
