module.exports = {
    jobExperience: async (user, args, { models }) => {
        return await models.JobExperience.find({ user: user._id })
    },
    education: async (user, args, { models }) => {
        return await models.Education.find({ user: user._id })
    },
    appliedTo: async (user, __, { models }) => {
        return await models.JobPosting.find( { applied: user._id });
    },
    jobPostings: async (user, __, { models }) => {
        return await models.JobPosting.find( { hiringContact: user._id });
    },
}