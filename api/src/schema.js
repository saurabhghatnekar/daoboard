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
    website: String
    linkedIn: String
    github: String
    twitter: String
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
    myPostings: [JobPosting]!
    jobPostingsByCompany: [JobPosting]!
    jobPostingsByRole: [JobPosting]!
    jobPostingsByJobType: [JobPosting]!
    jobPostingsByCompanyType: [JobPosting]!

    """
    Recruiter queries
    """
    meRecruiter: Recruiter!
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

    updateUserStringField(field: String!, value: String!): User!
    updatePFP(pfp: Upload!): User!
    updateCurrentRole(currentRole: Role!): User!
    updateExperience(experience: Experience!): User!
    updateOpenToRoles(openToRoles: [Role]!): User!
    updateSkills(skills: [String]!): User!
    updateResume(pfp: Upload!): User!
    updateStatus(status: Status!): User!
    updateJobType(jobType: [JobType]!): User!

    createJobExperience(
        company: String!,
        title: String!,
        startDate: Date!,
        endDate: Date!,
        description: String!
        positionType: jobExperienceType!
    ): JobExperience!
    updateJobExperienceStringField(id: ID!, field: String!, 
        value: String!): JobExperience!
    updateJobExperienceDateField(id: ID!, field: String!, 
        value: Date!): JobExperience!
    updatePositionType(id: ID!,
        positionType: jobExperienceType!): JobExperience!

    createEducation(
        college: String!,
        graduation: Date,
        degreeType: DegreeType,
        major: String,
        gpa: Float,
        gpaMax: Float
    ): Education!
    updateDegreeType(id: ID!, degreeType: DegreeType!): Education!
    updateEducationStringField(id: ID!, field: String!, 
        value: String!): Education!
    updateEducationFloatField(id: ID!, field: String!, 
        value: Float!): Education!
    updateGraduation(id: ID!, graduation: Date!): Education!
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
