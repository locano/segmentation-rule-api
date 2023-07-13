const express = require("express");
const { evaluateSRE, evaluateSRESF } = require("../logic/evaluation");
const { getUserSegment, getUserFromBucket } = require("../logic/segments");
const router = new express.Router();

router.post("/tree/evaluateUsers", async (req, res) => {
    try {
        let tree = req.body.tree;
        let variables = req.body.variables;
        let path = req.body.path ? req.body.path : null;
        let userSegment = await getUserFromBucket(path);
        let results = await evaluateSRESF(tree, variables, userSegment);
        res.status(200).send(results);
    } catch (e) {
        res.status(500).send();
    }
})

router.post("/tree/evaluate", async (req, res) => {
    try {
        let tree = req.body.tree;
        let variables = req.body.variables;
        // Obtener segmento de usuarios
        let limitUsers = req.body.limit ? Number(req.body.limit) : null;
        let testUser = req.body.testUser ? Number(req.body.testUser) : null;
        let userSegment = await getUserSegment(tree.conditions, limitUsers, testUser);
        // Evaluar un segmento de usuarios y extraer outputs
        let results = await evaluateSRE(tree, variables, userSegment);
        res.status(200).send(results);
    } catch (e) {
        res.status(500).send();
    }
})

module.exports = router;