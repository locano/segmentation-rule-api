const User = require("../models/user");

const defaultValues = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('roles');
        const token = await user.generateAuthToken();

        if (!user) {
            throw new Error();
        }

        res.send({ user, token });
    } catch (e) {
        res.status(401).send({ error: "Error on checking default values." });
    }
};

module.exports = defaultValues;
