const mongoose = require("mongoose");

const SettingSchema = mongoose.Schema(
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
        },
        "defaultValue":{
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const Setting = mongoose.model("Setting", SettingSchema);

module.exports = Setting;