const mongoose = require("mongoose");

const variableSchema = mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            trim: true,
        },
        value: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            trim: true,
        }
    },
    {
        timestamps: true,
    }
);

const Variable = mongoose.model("Variable", variableSchema);

module.exports = Variable;