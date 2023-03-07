const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
    {
        jobSeekerId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
        },

    }, {
        timestamps: true
    });

module.exports = mongoose.model('Match', matchSchema);
