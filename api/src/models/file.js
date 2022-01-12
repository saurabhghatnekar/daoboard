const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        },
        encoding: {
            type: String,
            required: true
        },

    }
)

module.exports = mongoose.model('file', fileSchema);