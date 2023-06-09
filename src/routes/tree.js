const express = require("express");
const SrTree = require("../models/userData/srTree");
const { find_paths, traverse, extractConditions } = require("../logic/paths");
const { evaluateSRE } = require("../logic/logic");
const router = new express.Router();



router.post("/tree", async (req, res) => {
    try {
        let tree = {}
        if(req.body._id){
            tree = await  SrTree.findById(req.body._id);
            tree.set(req.body);
        }else{
            tree = await SrTree(req.body);
        }
        await tree.save();
        let trees = await SrTree.find({});
        res.status(200).send(trees);
    } catch (e) {
        res.status(500).send();
    }
})

// Delete tree
router.delete("/tree/:id", async (req, res) => {
    try {
        let tree = await SrTree.findById(req.params.id);
        await tree.remove();
        res.status(200)
    } catch (e) {
        res.status(500).send();
    }
})


router.post("/tree/test", async (req, res) => {
    try {
        let tree = req.body;
        let conditionsObj = {};
        extractConditions(tree, conditionsObj);
        let conditionsArray = Object.values(conditionsObj);
        let paths = find_paths(tree);

        let response = {
            conditions: conditionsArray,
            paths: paths
        }
        res.status(200).send(response);
    } catch (e) {
        res.status(500).send();
    }
})


router.post("/tree/nodes", async (req, res) => {
    try {
        let tree = req.body;
        let conditionsObj = {};
        extractConditions(tree, conditionsObj);
        let conditionsArray = Object.values(conditionsObj);
        res.status(200).send(conditionsArray);
    } catch (e) {
        res.status(500).send();
    }
})

router.post("/tree/paths", async (req, res) => {
    try {
        let tree = req.body;
        let paths = find_paths(tree);
        res.status(200).send(paths);
    } catch (e) {
        res.status(500).send();
    }
})

router.post("/tree/evaluate", async (req, res) => {
    try {
        let tree = req.body.tree;
        let variables = req.body.variables;
        let limitUsers = req.body.limitUsers ? Number(req.body.limitUsers) : null;
        let testUser = req.body.testUser ? Number(req.body.testUser) : null;

        let paths = await evaluateSRE(tree, variables, limitUsers, testUser);
        res.status(200).send(paths);
    } catch (e) {
        res.status(500).send();
    }
})


module.exports = router;