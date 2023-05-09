const User = require("../models/catalogues/user");
const { evaluateConditions } = require("./conditions");

async function getUserSegment(tree) {
    let users = await User.find({});
    let filterUsers = [];
    await Promise.all(
        users.map((user, index) => {
            let userData = user.data;
            let resultRoot = evaluateConditions(tree.conditions, userData)
            if (resultRoot) {
                filterUsers.push(user);
            }
        }));

    return filterUsers;
}

module.exports = { getUserSegment }