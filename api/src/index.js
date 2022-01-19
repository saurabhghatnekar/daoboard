require('dotenv').config();

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const jwt = require('jsonwebtoken');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const db = require('./db');
const models = require('./models');

const port = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
db.connect(DB_HOST);

const getUser = token => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
      throw new Error('Session invalid');
    }
  }
};



async function startServer() {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        const token = req.headers.authorization;
        const user = getUser(token);
        return { models, user };
      }
    });
  
    await server.start();
  
    const app = express();
  
    // This middleware should be added before calling `applyMiddleware`.
    app.use(graphqlUploadExpress());
  
    server.applyMiddleware({ app });
  
    await new Promise(r => app.listen({ port }, r));
  
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  }
  
  startServer();



