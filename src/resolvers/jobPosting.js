const {createCompany} = require("./mutation");
module.exports = {
    applied: async (jobPosting, args, { models }) => {
        return await models.User.find({ _id: jobPosting.applied })
    },
    hiringContact: async (jobPosting, args, { models }) => {
        return await models.User.findOne({ _id: jobPosting.hiringContact })
    },
    company: async (jobPosting, args, { models }) => {
        return models.Company.findOne({_id: jobPosting.company});
    },
}