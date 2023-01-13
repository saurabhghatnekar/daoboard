require('dotenv').config();

const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const {graphqlUploadExpress} = require('graphql-upload');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');
const morganBody = require('morgan-body');
const bodyParser = require('body-parser');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');
const db = require('./src/db');
const models = require('./src/models');

const port = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
db.connect(DB_HOST);


const getUser = token => {
    if (token) {
        try {
            console.log("token", token);
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.log(err);
            return {}
            //throw new Error('Session invalid');

        }
    }
};


async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        playground: true,
        context: ({req}) => {

            const token = req.headers.authorization;
            const user = getUser(token);
            return {models, user};
        }
    });

    await server.start();

    const app = express();
    // app.use(helmet());
    // app.use(cors());
    app.use(bodyParser.json());
    // This middleware should be added before calling `applyMiddleware`.
    app.use(graphqlUploadExpress());
    app.use((err, req, res, next) => {
        console.error(err.stack)
        res.status(500).send('Something broke!')
    })
    // morganBody(app);
    server.applyMiddleware({app});

    await new Promise(r => app.listen({port}, r));

    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();


