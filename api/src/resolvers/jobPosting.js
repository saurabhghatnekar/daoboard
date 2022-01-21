module.exports = {
    applied: async (jobPosting, args, { models }) => {
        return await models.User.find({ _id: jobPosting.applied })
    },
}