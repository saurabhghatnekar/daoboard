module.exports = {
    appliedTo: async (user, __, { models }) => {
        return await models.JobPosting.find( { applied: user._id });
    }
}