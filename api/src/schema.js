const { gql } = require('apollo-server-express');

// Add salary min, salary max, and hourly rate to job posting

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
    publicKey: String
    accountType: [AccountType]

    """
    Match info
    """

    matchedTo: [JobPosting]!
    matchedFrom: [JobPosting]!
    matches: [JobPosting]!
    rejected: [JobPosting]!

    """
    Recruiter info
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
    openToRoles: [Role]!
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
    Status
    """

    status: Status!

    """
    Job type
    """

    hereTo: [jobType!]!

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
    recruiters: [User!]!
    founders: [User]!
    jobsPostings: [JobPosting]!
}

type JobPosting {
    id: ID!
    company: Company!
    title: String!
    about: String!
    experienceRequired: Experience
    roles: [Role!]!
    jobType: JobType!
    hiringContact: User!
    matchedTo: [User]!
    matchedFrom: [User]!
    matches: [User]!
    rejected: [User]!
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
    ): JobExperience!
    updateJobExperience(
        id: ID!
        field: String!
        stringValue: String
        dateValue: Date
    ): JobExperience!

    createEducation(
        college: String!
        graduation: Date
    ): Education!
    updateEducation(
        id: ID!
        field: String!
        dateValue: Date
        stringValue: String
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
    ): JobPosting!
    updateJobPosting(
        id: ID!
        field: String!
        stringValue: String,
        experienceValue: Experience,
        rolesValue: [Role],
        jobTypeValue: JobType,
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
    startDate: Date
    endDate: Date
    user: User!
}

type Education {
    college: String!
    user: User!
    graduation: Date
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
        HardwareEngineer
    
        """
        Art and Design
        """
    
        UIUXDesigner
        Artist

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
        Community
        """

        CommunityManager

        """
        Investing
        """

        InvestmentAnalyst
    
        """
        Other
        """

        ProjectManager
        Attorney
        
    
}

enum Experience {
    ZeroToTwoYears
    TwoToFiveYears
    MoreThanFiveYears
}

enum Market {
    DeFi
    Gaming
    Metaverse
    L1
    L2
    Social
    NFTs
    Education
    Investing
    Other
}

enum jobExperienceType {
    Nontechnical
    Technical
}

enum Status {
    Open
    Closed
}

enum jobType {
    FindFullTime
    FindPartTime
    StartSomethingNew
    MakeFriendsAndHaveFun
}

enum companyType {
    DAO
    Centralized
}

`;
