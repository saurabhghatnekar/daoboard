module.exports = {
    jobsPostings: async (company, args, { models }) => {
        return await 
        models.JobPosting.find({ _id: company.jobsPostings })
    },
};