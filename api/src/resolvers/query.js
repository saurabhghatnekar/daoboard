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
    jobPostings: async (_, filter, { models }) => {
        const shouldApplyFilters = filter !== null;
        
        if (!shouldApplyFilters) {
            return await models.JobPosting.find();
        }

        const shouldApplyCompanyNameFilter = filter.companyName !== null;
        const shouldApplyCompanyTypeFilter = filter.companyType !== null;
        //const shouldApplyRolesFilter = filter.roles;
        const shouldApplyJobTypesFilter = filter.jobTypes;
        var jobPostings = models.JobPosting;

        if (shouldApplyCompanyNameFilter) {
            jobPostings = models.JobPosting.find(
                { "company.name": filter.companyName }

            )
        }
        // if (shouldApplyCompanyTypeFilter) {
        //     jobPostings = models.JobPosting.find()
        //     .filter((a) => a.company.companyType === filter.companyType);
        // }

        // if (shouldApplyRolesFilter) {
        //     jobPostings = await models.JobPosting.find()
        //     .filter((a) => a.company.companyType === filter.companyType);
        //     albums = albums.filter((a) => ids.includes(a.id))
        // }

        if (shouldApplyJobTypesFilter) {
            jobPostings = await jobPostings.find(
                { jobType: { $in: filter.jobTypes } }

            )
        }

        return jobPostings;


        

    },

    // User queries
    me: async (_, __, { models, user }) => {
        return await models.User.findById(user.id);
    },
    

};