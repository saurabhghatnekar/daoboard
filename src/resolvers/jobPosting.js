const {createCompany} = require("./mutation");
module.exports = {
    applied: async (jobPosting, args, {models}) => {
        return await models.User.find({_id: jobPosting.applied})
    },
    company: async (jobPosting, args, {models}) => {
        return await models.Company.findOne({_id: jobPosting.company});
    },
    recruiter: async (jobPosting, args, {models}) => {
        return await models.User.findOne({_id: {$in: jobPosting.hiringContact}});
    }
}