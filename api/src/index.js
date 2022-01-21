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

// Set value of `isUserAccount`
// Function should be called in UI
const setAccountType = () => {
  isUserAccount = true;
  return isUserAccount
};

const getUserOrRecruiter = token => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
     // throw new Error('Session invalid');
    }
  }
};



async function startServer() {
  const isUserAccount = setAccountType();
  const isRecruiterAccount = !isUserAccount
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization;
      if (isUserAccount) {
        const user = getUserOrRecruiter(token);
        return { models, user };
        }
      else if (isRecruiterAccount) {
        const recruiter = getUserOrRecruiter(token);
        return { models, recruiter };
        }
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



