const mongoose = require("mongoose");

const usersSchema = mongoose.Schema(
    {
        msidn: {
            type: String,
            required: true,
            trim: true,

        },
        data: {
            type: Object
        }
    }
);

const User = mongoose.model("User", usersSchema);

module.exports = User;