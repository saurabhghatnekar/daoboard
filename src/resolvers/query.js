const {argsToArgsConfig} = require("graphql/type/definition");
const mongoose = require('mongoose');

module.exports = {
    // General queries
    uploads: (_, __) => {
    },

    me: async (_, __, {models, user}) => {

        return await models.User.findById(user.id);

    },
    users: async (_, filter, {models, user}) => {

        const userData = await models.User.findById(user.id);
        // console.log("userData", userData.firstName);

        const idsToExclude = userData.shortlistedCandidates.concat(userData.rejectedCandidates);
        // console.log("idsToExclude", idsToExclude);
        const shouldApplyFilters = Object.keys(filter).length !== 0;

        if (!shouldApplyFilters) {
            return await models.User.find({_id: {$nin: idsToExclude}});
        }

        const shouldApplyExperienceFilter = filter.experience;
        const shouldApplyCurrentRolesFilter = filter.currentRoles;
        const shouldApplyOpenToRolesFilter = filter.openToRoles;
        const shouldApplyJobTypesFilter = filter.jobTypes;

        var users = models.User;

        if (shouldApplyExperienceFilter) {
            users = users.find(
                {experience: {$in: filter.experience, _id: {$nin: idsToExclude}}}
            )
        }

        if (shouldApplyCurrentRolesFilter) {
            users = users.find(
                {currentRole: {$in: filter.currentRoles, _id: {$nin: idsToExclude}}}
            )
        }

        if (shouldApplyOpenToRolesFilter) {
            users = users.find(
                {openToRoles: {$elemMatch: {$in: filter.openToRoles}}}
            )
        }

        if (shouldApplyJobTypesFilter) {
            users = users.find(
                {jobType: {$elemMatch: {$in: filter.jobTypes}}, _id: {$nin: idsToExclude}}
            )
        }

        return await users;
    },
    companies: async (_, __, {models}) => {
        return await models.Company.find();
    },


    // jobPostings: async (_, filter, {models, user}) => {
    //     const shouldApplyFilters = Object.keys(filter).length !== 0;
    //     const userData = await models.User.findById(user.id);
    //     const idsToExclude = userData.appliedTo.concat(userData.rejected);
    //
    //     if (!shouldApplyFilters) {
    //         const openToRoles = userData.openToRoles;
    //         const interestedInRoles = await models.JobPosting.find({
    //             _id: {$nin: idsToExclude},
    //             roles: {$elemMatch: {$in: openToRoles}}
    //         });
    //         const notInterestedInRoles = await models.JobPosting.find({
    //             _id: {$nin: idsToExclude},
    //             roles: {$not: {$elemMatch: {$in: openToRoles}}}
    //         });
    //         return interestedInRoles.concat(notInterestedInRoles);
    //
    //     }
    //
    //     // console.log("userData", userData);
    //     const shouldApplyCompanyNameFilter = filter.companyName != null;
    //     const shouldApplyCompanyTypeFilter = filter.companyType != null;
    //     const shouldApplyRolesFilter = filter.roles;
    //     const shouldApplyJobTypesFilter = filter.jobTypes;
    //
    //     var jobPostings = models.JobPosting;
    //     var company;
    //
    //     if (shouldApplyCompanyNameFilter) {
    //         company = await models.Company.findOne({
    //             name: filter.companyName,
    //
    //         });
    //         jobPostings = jobPostings.find(
    //             {
    //                 company,
    //                 _id: {$nin: idsToExclude}
    //             }
    //         )
    //     }
    //
    //     if (shouldApplyCompanyTypeFilter) {
    //         company = await models.Company.find({
    //             type: filter.companyType,
    //
    //         });
    //         jobPostings = jobPostings.find(
    //             {
    //                 company,
    //
    //                 _id: {$nin: idsToExclude}
    //             }
    //         )
    //     }
    //
    //     if (shouldApplyRolesFilter) {
    //         jobPostings = jobPostings.find(
    //             {
    //                 roles: {$elemMatch: {$in: filter.roles}},
    //                 _id: {$nin: idsToExclude}
    //             }
    //         )
    //     }
    //
    //     if (shouldApplyJobTypesFilter) {
    //         jobPostings = jobPostings.find(
    //             {
    //                 jobTypes: {$in: filter.jobTypes},
    //                 _id: {$nin: idsToExclude}
    //             }
    //         )
    //     }
    //
    //     return await jobPostings;
    //
    // },

    jobPosting: async (_, {id}, {models, user}) => {
        return await models.JobPosting.findById(id);
    },

    jobPostings: async (_, filter, {models, user}) => {
        console.log("jobPostings", user);
        const shouldApplyFilters = Object.keys(filter).length !== 0;
        const userData = await models.User.findById(user.id);
        // console.log("userData", userData.shortlistedCompanies);
        const idsToExclude = userData.shortlistedCompanies.concat(userData.rejectedCompanies);
        // console.log("idsToExclude", idsToExclude);
        if (!shouldApplyFilters) {
            console.log(await models.Company.find({_id: {$nin: idsToExclude}}))
            return await models.Company.find({_id: {$nin: idsToExclude}});
        }

        const shouldApplyCompanyNameFilter = filter.companyName != null;
        const shouldApplyCompanyTypeFilter = filter.companyType != null;

        let companies = models.Company;

        if (shouldApplyCompanyNameFilter) {
            companies = companies.find({name: filter.companyName})
        }

        if (shouldApplyCompanyTypeFilter) {
            companies = companies.find({type: filter.companyType})
        }

        return await companies;

    },

    getJobSeekers: async (_, filter, {models, user}) => {

        const userData = await models.User.findById(user.id);
        const company = await models.Company.findById(userData.companyId);
        // console.log("company", company.shortlistedJobSeekersList);
        const idsToExclude = userData.shortlistedJobSeekers.concat(userData.rejectedJobSeekers).concat(company.shortlistedJobSeekersList)


        const shouldApplyFilters = Object.keys(filter).length !== 0;

        if (!shouldApplyFilters) {
            return await models.User.find({
                accountType: "JobSeeker", _id: {$nin: idsToExclude}
            });
        }

        // const shouldApplyExperienceFilter = filter.experience;
        // const shouldApplyCurrentRolesFilter = filter.currentRoles;
        // const shouldApplyOpenToRolesFilter = filter.openToRoles;
        // const shouldApplyJobTypesFilter = filter.jobTypes;

        var users = models.User;

        users = users.find({
            accountType: "JobSeeker",
            currentRole: filter.currentRole,
            experience: filter.experience, // jobType: {$elemMatch: {$in: filter.jobTypes||}},
            _id: {$nin: idsToExclude}
        })

        return await users;
    },

    getMatchedJobSeekers: async (_, __, {models, user}) => {
        let filteredArray = []
        const currentUser = await models.User.findOne({_id: user.id});
        const candidates = await models.User.find({recruitersOfApplied: {$in: [user._id]}});
        const candidateIds = candidates.map(candidate => candidate._id.toString());
        const shortlistedCandidates = currentUser.shortlistedCandidates;
        const shortlistedCandidateIds = shortlistedCandidates.map(candidate => candidate._id.toString());
        filteredArray = candidateIds.filter(value => shortlistedCandidateIds.includes(value))
        filteredArray = Array.from(new Set(filteredArray));
        return await models.User.find({'_id': {$in: filteredArray}})

    },
    getMatchedCompanies: async (_, __, {models, user}) => {
        const currentUser = await models.User.findOne({_id: user.id});
        let filteredArray = []
        if (currentUser.accountType[0] === 'JobSeeker') {
            const shortlistedCompanies = currentUser.shortlistedCompanies;
            const jobSeekerShortlistedCompanies = await models.Company.find({shortlistedJobSeekersList: {$in: [currentUser._id]}}, {_id: 1});
            const jobSeekerShortlistedCompaniesIds = jobSeekerShortlistedCompanies.map(company => company._id.toString());
            const shortlistedCompaniesId = shortlistedCompanies.map(company => company.toString());
            const filteredArray = shortlistedCompaniesId.filter(company => jobSeekerShortlistedCompaniesIds.includes(company));
            return await models.Company.find({_id: {$in: filteredArray}})
        }
    },


};