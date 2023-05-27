const mongoose = require('mongoose');

module.exports = {
    connect: async DB_HOST => {
        mongoose.connect(DB_HOST);
        await mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB!');
        });
        mongoose.connection.on('error', err => {
            console.error(err);
            console.log(
                'MongoDB conenction error. Please make sure MongoDB is running.'
            );
            process.exit();
        });
    },

    close: () => {
        mongoose.connection.close();
    }
};