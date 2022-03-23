module.exports = {
    jobsPostings: async (company, args, { models }) => {
        return await models.JobPosting.find({ company: company.id })
    },
    recruiters: async (company, args, { models }) => {
        return await models.User.find({ _id: company.recruiters })
    },
};