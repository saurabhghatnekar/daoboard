const { argsToArgsConfig } = require("graphql/type/definition");

module.exports = {
    // General queries
    uploads: (_, __) => {},
    users: async (_, __, { models }) => {
        return await models.User.find();
    },
    companies: async (_, __, { models }) => {
        return await models.Company.find();
    },
    jobPostings: async (_, __, { models }) => {
        return await models.JobPosting.find();
    },

    // User queries
    me: async (_, __, { models, user }) => {
        return await models.User.findById(user.id);
    },
    company: async (_, args, { models }) => {
        return await models.Company.findById(args.id);
    },
    myPostings: async (company, __, { models }) => {
        return await models.JobPosting.find({ appliedTo: company.id });
    },
    jobPostingsByCompany: async (company, args, { models }) => {
        return await models.JobPosting.find({ "company._id": "args.id" });
    },
    jobPostingsByRole: async (_, _role, { models }) => {
        return await models.JobPosting.find({ role: _role });
    },
    jobPostingsByJobType: async (_, _jobType, { models }) => {
        return await models.JobPosting.find({ jobType: _jobType });
    },
    jobPostingsByCompanyType: async (_, _companyType, { models }) => {
        return await models.JobPosting.find({ companyType: _companyType });
    },

    // Recruiter queries
    RecruiterPostings: async (company, __, { models }) => {
        return await models.JobPosting.find({ jobPostings: company.id });
    },
    UsersByCurrentRole: async (_, _role, { models }) => {
        return await models.Users.find({ currentRole: _role });
    },
    UsersByOpenToRoles: async (_, _role, { models }) => {
        return await models.Users.find({ _role: { $in: openToRoles } } );
    },
    UsersByJobType: async (_, _jobType, { models }) => {
        return await models.Users.find({ _jobType: { $in: jobType } } );
    },
    UsersByExperience: async (_, _experience, { models }) => {
        return await models.Users.find({ _experience: { $in: _experience } } );
    },
    

};