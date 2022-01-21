const { argsToArgsConfig } = require("graphql/type/definition");

module.exports = {
    // General queries
    uploads: (_, __) => {},
    users: async (_, __, { models }) => {
        return await models.User.find();
    },
    companies: async (_, __, { models }) => {
        return await models.Company.find();
    },
    jobPostings: async (_, __, { models }) => {
        return await models.JobPosting.find();
    },

    // User queries
    me: async (_, __, { models, user }) => {
        return await models.User.findById(user.id);
    },
    

};