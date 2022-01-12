const { GraphQLUpload } = require('graphql-upload');
const { GraphQLDate } = require('graphql-scalars');
const { GraphQLURL } = require('graphql-scalars');
const { GraphQLEmailAddress } = require('graphql-scalars');

const Query = require('./query');
const Mutation = require('./mutation');

module.exports = {
    Query,
    Mutation,
    Upload: GraphQLUpload,
    Date: GraphQLDate,
    URL: GraphQLURL,
    Email: GraphQLEmailAddress
};