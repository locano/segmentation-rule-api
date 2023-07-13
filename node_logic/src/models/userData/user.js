const mongoose = require("mongoose");
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;
const usersSchema = mongoose.Schema(
    {
        msisdn: {
            type: Long
        }
    }
);

const User = mongoose.model("User", usersSchema);

module.exports = User;