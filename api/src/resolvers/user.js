module.exports = {
    appliedTo: async (user, __, { models }) => {
        return await models.JobPosting.find( { usersApplied: user._id });
    }
}