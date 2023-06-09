const express = require("express");
const { evaluateSRE } = require("../logic/evaluation");
const { getUserSegment } = require("../logic/segments");
const { getMetrics } = require("../logic/metrics");
const { checkSettings } = require("../logic/settings");
const router = new express.Router();


router.post("/tree/evaluate", async (req, res) => {
    try {
        let tree = req.body.tree;
        let variables = req.body.variables;
        // Obtener segmento de usuarios
        let limitUsers = req.body.limitUsers ? Number(req.body.limitUsers) : null;
        let testUser = req.body.testUser ? Number(req.body.testUser) : null;
        let userSegment = await getUserSegment(tree.conditions, limitUsers, testUser);
        // Evaluar un segmento de usuarios y extraer outputs
        let paths = await evaluateSRE(tree, variables, userSegment);
        res.status(200).send(paths);
    } catch (e) {
        res.status(500).send();
    }
})

router.get("/tree/segment", async (req, res) => {
    try {
        let conditions = req.body.conditions;
        let limitUsers = req.body.limitUsers ? Number(req.body.limitUsers) : null;
        let testUser = req.body.testUser ? Number(req.body.testUser) : null;
        let userSegment = await getUserSegment(conditions, limitUsers, testUser);
        res.status(200).send(userSegment);
    } catch (e) {
        res.status(500).send();
    }
})

router.get("/tree/settings", async (req, res) => {
    try {
        let outputs = req.body.outputs;
        let settings = req.body.settings;
        let result = await checkSettings(outputs, settings);
        res.status(200).send(result);
    } catch (e) {
        res.status(500).send();
    }
})

router.get("/tree/metrics", async (req, res) => {
    try {
        let metrics = req.body.metrics;
        let userData = req.body.userData;
        let result = await getMetrics(metrics, userData);
        res.status(200).send(result);
    } catch (e) {
        res.status(500).send();
    }
})

module.exports = router;