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
const {FirebaseAdmin} = require('./src/helpers/firebase/firebase.helper');
// console.log("firebaseApp", firebaseApp);
const port = process.env.PORT;
const DB_HOST = process.env.DB_HOST;
db.connect(DB_HOST);

const getUser = async token => {
    if (token) {
        try {
            return FirebaseAdmin.auth().verifyIdToken(token)
                .then(async function (decodedToken) {
                        const uid = decodedToken.uid;
                        if (!uid) {
                            return {}
                        }
                        const user = await models.User.findOne({uid})

                        if (!user) {

                            return uid
                        }

                        return user.id;
                    }
                ).catch(function (error) {
                    console.log(error)
                    return {}
                })

            //return jwt.verify(token, process.env.JWT_SECRET);
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
        context: async ({req}) => {
            const token = req.headers.authorization;
            const userId = await getUser(token);
            let user = {id: userId}
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


