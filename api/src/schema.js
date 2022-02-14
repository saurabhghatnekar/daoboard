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
    Recruiter account info
    """

    company: Company
    isFounder: Boolean
    jobPostings: [JobPosting]!

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
    Social media
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


type Company {
    id: ID!
    name: String!
    logo: File
    type: companyType!
    website: String
    linkedIn: String
    github: String
    twitter: String
    markets: [Market]!
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
    signUp(email: Email!, password: String!, firstName: String!, lastName:String!): String!
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
    
        MobileDeveloper
        FrontendDeveloper
        BackendDeveloper
        FullStackDeveloper
        SoftwareDeveloper
        SmartContractEngineer
        BlockchainEngineer
    
        """
        Designer
        """
    
        UIUXDesigner

        """
        Product
        """
  
        ProductManager
    
        """
        Operations
        """
    
        Finance
        HR
        CustomerService

        """
        Sales
        """
 
        Sales
    
        """
        Marketing
        """
  
        Marketing
        GrowthHacker
        ContentCreator
        SocialMediaManager
            
        """
        Management
        """
  
        Management
    
        """
        Other Engineering
        """

        HardwareEngineer
    
        """
        Other
        """

        Artist
        CommunityManager
        ProjectManager
        Attorney

        
    
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

enum Market {
    DeFi
    Gaming
    Metaverse
    L1
    L2
    Social Media
    NFTs
    Education
    Marketplace
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
