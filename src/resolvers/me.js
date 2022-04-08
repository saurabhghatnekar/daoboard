module.exports = {
     jobExperience: async (_, args, { models, user }) => {
        return await models.JobExperience.find({ user: user.id })
    },
    education: async (_, args, { models,  }) => {
        return await models.Education.find({ user: user._id })
    },
    appliedTo: async (user, __, { models }) => {
        return await models.JobPosting.find( { applied: user._id });
    },
    jobPostings: async (user, __, { models }) => {
        return await models.JobPosting.find( { hiringContact: user._id });
    },
    company: async (user, __, { models }) => {
        return await models.Company.findOne( { _id: user.company });
    },
}