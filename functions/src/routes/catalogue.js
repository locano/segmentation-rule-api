const express = require("express");
const { ObjectId, Db } = require("mongodb");
const router = new express.Router();
const Owner = require("../models/catalogues/owner");
const SrTree = require("../models/catalogues/srTree");
const FieldTypes = require("../models/catalogues/fieldType");
const Operator = require("../models/catalogues/operator");
const Output = require("../models/catalogues/output");
const ValueType = require("../models/catalogues/valueType");
const CustomerData = require("../models/catalogues/customerData");


// Getting Tree
router.get("/catalogue/trees", async (req, res) => {
  try {

    let trees = await SrTree.find({});
    res.status(200).send(trees);
  } catch (e) {
    res.status(500).send();
  }
})

// Getting FieldTypes
router.get("/catalogue/fieldTypes", async (req, res) => {
  try {

    let fieldTypes = await FieldTypes.find({});
    res.status(200).send(fieldTypes);
  } catch (e) {
    res.status(500).send();
  }
})

// Getting ValueTypes
router.get("/catalogue/valueTypes", async (req, res) => {
  try {

    let valueTypes = await ValueType.find({});
    res.status(200).send(valueTypes);
  } catch (e) {
    res.status(500).send();
  }
})


// Getting Operators
router.get("/catalogue/operators", async (req, res) => {
  try {

    let operators = await Operator.find({});
    res.status(200).send(operators);
  } catch (e) {
    res.status(500).send();
  }
})

// Getting Outputs
router.get("/catalogue/outputs", async (req, res) => {
  try {

    let outputs = await Output.find({});
    res.status(200).send(outputs);
  } catch (e) {
    res.status(500).send();
  }
})

// Getting Owners
router.get("/catalogue/owners", async (req, res) => {
  try {

    let owners = await Owner.find({});
    res.status(200).send(owners);
  } catch (e) {
    res.status(500).send();
  }
})
// Getting All Catalogues
router.get("/catalogue/all", async (req, res) => {
  try {

    let owners = await Owner.find({});
    let fieldTypes = await FieldTypes.find({});
    let operators = await Operator.find({});
    let outputs = await Output.find({});
    let trees = await SrTree.find({});
    let valueTypes = await ValueType.find({});
    let customerData = await CustomerData.find({});

    let data = {
      owners,
      fieldTypes,
      operators,
      outputs,
      trees,
      valueTypes,
      customerData
    }
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send();
  }
})

// Getting Test
router.get("/catalogue/test", async (req, res) => {
  try {
    let customerData = new CustomerData({"key":"ARPU", "value":"ARPU", "source": "CUSTOMER_PROFILE"});
    await customerData.save();
    customerData = new CustomerData({"key":"CHURN", "value":"Chrun", "source": "CUSTOMER_PROFILE"});
    await customerData.save();
    customerData = new CustomerData({"key":"UPSELL", "value":"Model Upsell", "source": "MODEL"});
    await customerData.save();
    customerData = new CustomerData({"key":"X3", "value":"Model X3", "source": "MODEL"});
    await customerData.save();
    res.status(200).send(customerData);
  } catch (e) {
    res.status(500).send();
  }
})


module.exports = router;