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
        return await models.JobPosting.find({hiringContact: user._id});
    },
    company: async (user, __, {models}) => {
        return await models.Company.findOne({_id: user.company});
    },
    matches: async (user, __, {models}) => {
        const currentUser = await models.User.findOne({_id: user._id});

        let filteredArray = []
        if (currentUser.accountType[0] === 'JobSeeker'){
            const recruiters = await models.User.find({shortlistedCandidates: { $in: [ user._id ] } });
            const recruitersIds = recruiters.map(recruiter => recruiter._id.toString());
            const recruitersOfApplied = currentUser.recruitersOfApplied;
            const recruitersOfAppliedIds = recruitersOfApplied.map(recruiter => recruiter.toString());
            filteredArray = recruitersIds.filter(value => recruitersOfAppliedIds.includes(value));
            filteredArray = Array.from(new Set(filteredArray));
             // console.log("recruiters", new Set(recruiters.map(r=>r._id.toString())));
             // console.log("recruitersOfApplied", new Set(recruitersOfApplied.map(r=>r._id.toString())));
        }

        else {
            const candidates =  await models.User.find({recruitersOfApplied: { $in: [ user._id ] } });
            const candidateIds = candidates.map(candidate => candidate._id.toString());
            const shortlistedCandidates = currentUser.shortlistedCandidates;
            const shortlistedCandidateIds = shortlistedCandidates.map(candidate => candidate._id.toString());
            filteredArray = candidateIds.filter(value => shortlistedCandidateIds.includes(value))
            filteredArray = Array.from(new Set(filteredArray));
        }
            return await models.User.find({ '_id': { $in: filteredArray } });
    },
}