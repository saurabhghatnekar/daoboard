const {argsToArgsConfig} = require("graphql/type/definition");
const mongoose = require('mongoose');

module.exports = {
    // General queries
    uploads: (_, __) => {
    },

    me: async (_, __, {models, user}) => {

        return await models.User.findById(user.id);

    },
    users: async (_, filter, {models}) => {
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
                {experience: {$in: filter.experience}}
            )
        }

        if (shouldApplyCurrentRolesFilter) {
            users = users.find(
                {currentRole: {$in: filter.currentRoles}}
            )
        }

        if (shouldApplyOpenToRolesFilter) {
            users = users.find(
                {openToRoles: {$elemMatch: {$in: filter.openToRoles}}}
            )
        }

        if (shouldApplyJobTypesFilter) {
            users = users.find(
                {jobType: {$elemMatch: {$in: filter.jobTypes}}}
            )
        }

        return await users;
    },
    companies: async (_, __, {models}) => {
        return await models.Company.find();
    },

    jobPostings: async (_, filter, {models, user}) => {
        const shouldApplyFilters = Object.keys(filter).length !== 0;
        const userData = await models.User.findById(user.id);
        const idsToExclude = userData.appliedTo.concat(userData.rejected);

        if (!shouldApplyFilters) {

            return await models.JobPosting.find({_id: {$nin: idsToExclude}});
        }

        // console.log("userData", userData);
        const shouldApplyCompanyNameFilter = filter.companyName != null;
        const shouldApplyCompanyTypeFilter = filter.companyType != null;
        const shouldApplyRolesFilter = filter.roles;
        const shouldApplyJobTypesFilter = filter.jobTypes;

        var jobPostings = models.JobPosting;
        var company;

        if (shouldApplyCompanyNameFilter) {
            company = await models.Company.findOne({
                name: filter.companyName,

            });
            jobPostings = jobPostings.find(
                {
                    company,
                    _id: {$nin: idsToExclude}
                }
            )
        }

        if (shouldApplyCompanyTypeFilter) {
            company = await models.Company.find({
                type: filter.companyType,

            });
            jobPostings = jobPostings.find(
                {
                    company,

                    _id: {$nin: idsToExclude}
                }
            )
        }

        if (shouldApplyRolesFilter) {
            jobPostings = jobPostings.find(

                {roles: {$elemMatch: {$in: filter.roles}},
                _id: {$nin: idsToExclude}}
            )
        }

        if (shouldApplyJobTypesFilter) {
            jobPostings = jobPostings.find(
                {jobTypes: {$in: filter.jobTypes},
                _id: {$nin: idsToExclude}
                }
            )
        }

        return await jobPostings;

    },


};