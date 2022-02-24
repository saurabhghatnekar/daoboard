const { argsToArgsConfig } = require("graphql/type/definition");
const mongoose = require('mongoose');

module.exports = {
    // General queries
    uploads: (_, __) => {},
    users: async (_, filter, { models }) => {
        const shouldApplyFilters = Object.keys(filter).length !== 0;

        if (!shouldApplyFilters) {
            return await models.User.find();
        }

        const shouldApplyExperienceFilter = filter.experience;
        const shouldApplyCurrentRolesFilter = filter.currentRoles;
        const shouldApplyOpenToRolesFilter = filter.openToRoles;
        const shouldApplyJobTypesFilter = filter.jobTypes;

        var users = models.User;

        if (shouldApplyExperienceFilter) {
            users = users.find(
                { experience: { $in: filter.experience } }
            )
        }

        if (shouldApplyCurrentRolesFilter) {
            users = users.find(
                { currentRole: { $in: filter.currentRoles } }
            )
        }

        if (shouldApplyOpenToRolesFilter) {
            users = users.find(
                { openToRoles: { $elemMatch: { $in: filter.openToRoles } } }
            )
        }

        if (shouldApplyJobTypesFilter) {
            users = users.find(
                { jobType: { $elemMatch: { $in: filter.jobTypes } } }
            )
        }

        return await users;
    },
    companies: async (_, __, { models, user }) => {
        return await models.Company.find();
    },
    jobPostings: async (_, filter, { models }) => {
        const shouldApplyFilters = Object.keys(filter).length !== 0;
        
        if (!shouldApplyFilters) {
            return await models.JobPosting.find(
                { _id: { $nin: user.rejected  } }
            );
        }

        const shouldApplyMarketsFilter = filter.markets;
        const shouldApplyCompanyTypeFilter = filter.companyType != null;
        const shouldApplyRolesFilter = filter.roles;
        const shouldApplyJobTypesFilter = filter.jobTypes;
        
        var jobPostings = models.JobPosting;
        var company;

        jobPostings = jobPostings.find(
            { _id: { $nin: user.rejected  } }
        );

        if (shouldApplyMarketsFilter) {
            company = await models.Company.findOne({
                markets: filter.markets
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
            jobPostings = jobPostings.find(
                { roles: { $elemMatch: { $in: filter.roles } } }
            )
        }

        if (shouldApplyJobTypesFilter) {
            jobPostings = jobPostings.find(
                { jobTypes: { $in: filter.jobTypes } }
            )
        }

        return await jobPostings;
    },
    JobPosting: async (_, { id }, { models }) => {
        return await models.JobPosting.findById(id)
    },
    Company: async (_, { id }, { models }) => {
        return await models.Company.findById(id)
    },
    

};