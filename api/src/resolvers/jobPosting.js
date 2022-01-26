module.exports = {
    applied: async (jobPosting, args, { models }) => {
        return await models.User.find({ _id: jobPosting.applied })
    },
    hiringContact: async (jobPosting, args, { models }) => {
        return await models.User.find({ _id: jobPosting.hiringContact })
    },
    company: async (jobPosting, args, { models }) => {
        return await models.Company.find({ _id: jobPosting.company })
    },
}