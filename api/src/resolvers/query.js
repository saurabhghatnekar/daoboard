const { argsToArgsConfig } = require("graphql/type/definition");
const mongoose = require('mongoose');

module.exports = {
    // General queries
    uploads: (_, __) => {},
    users: async (_, __, { models }) => {
        return await models.User.find();
    },
    companies: async (_, __, { models }) => {
        return await models.Company.find();
    },
    jobPostings: async (_, filter, { models }) => {
        const shouldApplyFilters = Object.keys(filter).length !== 0;
        
        if (!shouldApplyFilters) {
            return await models.JobPosting.find();
        }

        const shouldApplyCompanyNameFilter = filter.companyName != null;
        const shouldApplyCompanyTypeFilter = filter.companyType != null;
        const shouldApplyRolesFilter = filter.roles;
        const shouldApplyJobTypesFilter = filter.jobTypes;
        
        var jobPostings = models.JobPosting;
        var company;

        if (shouldApplyCompanyNameFilter) {
            company = await models.Company.findOne({
                name: filter.companyName
            });
            jobPostings = jobPostings.find(
                { company }
            )
        }

        if (shouldApplyCompanyTypeFilter) {
            company = await models.Company.find({
                type: filter.companyType
            });
            jobPostings = jobPostings.find(
                { company }
            )
        }

        if (shouldApplyRolesFilter) {
            jobPostings = await jobPostings.find(
                { roles: { $elemMatch: { $in: filter.roles } } }
            )
        }

        if (shouldApplyJobTypesFilter) {
            jobPostings = await jobPostings.find(
                { jobTypes: { $in: filter.jobTypes } }
            )
        }

        return jobPostings;


        

    },

    // User queries
    me: async (_, __, { models, user }) => {
        return await models.User.findById(user.id);
    },
    

};