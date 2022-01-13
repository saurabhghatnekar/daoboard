const { argsToArgsConfig } = require("graphql/type/definition");

module.exports = {
    // General queries
    uploads: (_, __) => {},
    users: async (_, __, { models }) => {
        return await models.User.find();
    },
    recruiters: async (_, __, { models }) => {
        return await models.Recruiter.find();
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
    jobPostingsByCompany: async (company, args, { models }) => {
        return await models.JobPosting.find({ "company._id": "args.id" });
    },
    jobPostingsByRole: async (_, args, { models }) => {
        return await models.JobPosting.find({ "company.role": "args.role" });
    },
    jobPostingsByJobType: async (_, args, { models }) => {
        return await models.JobPosting.find({ "company.jobType": "args.jobType" });
    },
    jobPostingsByCompanyType: async (_, args, { models }) => {
        return await models.JobPosting.find({ "company.companyType": "args.companyType" });
    },

};