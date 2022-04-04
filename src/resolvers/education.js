module.exports = {
    user: async (education, args, { models }) => {
        return await models.User.findById(education.user)
    }
}