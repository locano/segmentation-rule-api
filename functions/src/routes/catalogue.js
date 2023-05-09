const express = require("express");
const { ObjectId, Db } = require("mongodb");
const router = new express.Router();
const Owner = require("../models/catalogues/owner");
const SrTree = require("../models/catalogues/srTree");
const Output = require("../models/catalogues/output");
const CustomerData = require("../models/catalogues/customerData");
const { operators, valueTypes, fieldTypes } = require("../resources/data");
const csvToJson = require("csvtojson");
const User = require("../models/catalogues/user");

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
    res.status(200).send(fieldTypes);
  } catch (e) {
    res.status(500).send();
  }
})

// Getting ValueTypes
router.get("/catalogue/valueTypes", async (req, res) => {
  try {
    res.status(200).send(valueTypes);
  } catch (e) {
    res.status(500).send();
  }
})

// Getting Operators
router.get("/catalogue/operators", async (req, res) => {
  try {
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
    let outputs = await Output.find({});
    let trees = await SrTree.find({});
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
    let customerData = new CustomerData({ "key": "bu", "value": "bu", "source": "CUSTOMER_PROFILE", "type": "STRING" });
    await customerData.save();
    customerData = new CustomerData({ "key": "plan_type", "value": "Plan Type", "source": "CUSTOMER_PROFILE", "type": "STRING" });
    await customerData.save();
    customerData = new CustomerData({ "key": "status_grp", "value": "STATUS GRP", "source": "CUSTOMER_PROFILE", "type": "STRING" });
    await customerData.save();
    customerData = new CustomerData({ "key": "in_whitelist_piloto_control", "value": "IN WHITELIST PILOTO CONTROL", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await customerData.save();
    customerData = new CustomerData({ "key": "not_in_whitelist_antidowngrade", "value": "NOT IN WHITELIST ANTIDOWNGRADE", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await customerData.save();
    customerData = new CustomerData({ "key": "active_data_plan_inverse", "value": "Active Data Plan Inverse", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await customerData.save();
    customerData = new CustomerData({ "key": "last_connection", "value": "Last Connection", "source": "CUSTOMER_PROFILE", "type": "DATE" });
    await customerData.save();
    customerData = new CustomerData({ "key": "fl_optin", "value": "FL Optin", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await customerData.save();
    customerData = new CustomerData({ "key": "user_communication_upsell_benefit", "value": "User Communication Upsell Benefit", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await customerData.save();
    customerData = new CustomerData({ "key": "recharge_mode_1m", "value": "Rechargable Mode 1m", "source": "CUSTOMER_PROFILE", "type": "NUMBER" });
    await customerData.save();
    customerData = new CustomerData({ "key": "fl_point_to_target", "value": "FL Point to Target", "source": "CUSTOMER_PROFILE", "type": "NUMBER" });
    await customerData.save();
    customerData = new CustomerData({ "key": "user_communication_2x_loyalty", "value": "User Communication 2X Loyalty", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await customerData.save();
    customerData = new CustomerData({ "key": "user_communication_upsell", "value": "User Communication Upsell", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await customerData.save();
    customerData = new CustomerData({ "key": "is_vip1_product_user", "value": "IS VIP USER", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await customerData.save();
    customerData = new CustomerData({ "key": "user_communication_data_recommender_not_vip", "value": "User Communication Data Recommended No VIP", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await customerData.save();
    customerData = new CustomerData({ "key": "user_communication_data_recommender_vip", "value": "User Communication Data Recommended VIP", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await customerData.save();
    customerData = new CustomerData({ "key": "model", "value": "User Communication Data Recommended VIP", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await customerData.save();

    let customerDataInfo = await CustomerData.find({});
    res.status(200).send(customerDataInfo);
  } catch (e) {
    res.status(500).send();
  }
})

// Getting Test
router.get("/catalogue/testUsers", async (req, res) => {
  try {
    const csvFilePath = 'TEST.csv';

    const json = await csvToJson().fromFile(csvFilePath);

    const jsonString = JSON.stringify(json, null, 2)

    await Promise.all(json.map(async (element) => {
      let user = new User({"msidn": element.msidn, "data": element});
      await user.save();
    })).then((values) => {
      console.log(values);
    });

    let users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send();
  }
})


module.exports = router;