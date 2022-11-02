module.exports = {
    jobExperience: async (user, args, {models}) => {
        return await models.JobExperience.find({user: user._id})
    },
    education: async (user, args, {models}) => {
        return await models.Education.find({user: user._id})
    },
    appliedTo: async (user, __, {models}) => {

        return await models.JobPosting.find({applied: user._id});
    },
    jobPostings: async (user, __, {models}) => {

        const userData = await models.User.findById(user.id);
        const idsToExclude = userData.appliedTo.concat(userData.rejected);
         return await models.JobPosting.find({_id: {$nin: idsToExclude}});
    },
    company: async (user, __, {models}) => {
        return await models.Company.findOne({_id: user.company});
    },
    matches: async (user, __, {models}) => {
        // console.log("matches", user);
        const currentUser = await models.User.findOne({_id: user._id});

        let filteredArray = []
        if (currentUser.accountType[0] === 'JobSeeker'){
            const shortlistedCompanies = currentUser.shortlistedCompanies;
            console.log("shortlistedCompanies", shortlistedCompanies);

            const recruiters = await models.User.find({
                accountType: {$in: ['Recruiter','CompanyAdmin','CompanyUser','CompanyRecruiter']},
                companyId: {$in: shortlistedCompanies},
                shortlistedCandidates: { $in: [ user._id ] } }, { _id: 1 });
            console.log("recruiters", recruiters);

            const recruitersIds = recruiters.map(recruiter => recruiter._id.toString());
            const recruitersOfApplied = currentUser.recruitersOfApplied;
            const recruitersOfAppliedIds = recruitersOfApplied.map(recruiter => recruiter.toString());
            filteredArray = recruitersIds
            filteredArray = Array.from(new Set(filteredArray));
             // console.log("recruiters", new Set(recruiters.map(r=>r._id.toString())));
             // console.log("recruitersOfApplied", new Set(recruitersOfApplied.map(r=>r._id.toString())));
        }

        else {
            const shortlistedJobSeekers = currentUser.shortlistedJobSeekers;
            console.log("shortlistedJobSeekers", shortlistedJobSeekers);
            const candidates =  await models.User.find({
                _id: {$in: shortlistedJobSeekers},
                shortlistedCompanies: { $in: [ user.companyId ] }},{ _id: 1 });
            console.log("candidates", candidates);
            // const shortlistedCandidates = currentUser.shortlistedCandidates;
            // const shortlistedCandidateIds = shortlistedCandidates.map(candidate => candidate._id.toString());
            filteredArray = candidates.map(candidate => candidate._id.toString())
            filteredArray = Array.from(new Set(filteredArray));
        }
            return await models.User.find({ '_id': { $in: filteredArray } });
    },
}