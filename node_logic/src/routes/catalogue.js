const express = require("express");
const { ObjectId, Db } = require("mongodb");
const router = new express.Router();
const Owner = require("../models/userData/owner");
const SrTree = require("../models/userData/srTree");
const Output = require("../models/catalogues/output");
const Catalogue = require("../models/catalogues/catalogue");
const Product = require("../models/catalogues/product");
const { operators, valueTypes, fieldTypes } = require("../resources/data");
const csvToJson = require("csvtojson");
const User = require("../models/userData/user");
const Variable = require("../models/catalogues/variable");
const Setting = require("../models/catalogues/setting");
const { getProducts } = require("../logic/outputs");

// Getting Outputs
router.get("/catalogue/products", async (req, res) => {
  try {
    let contidions = [
      [
        {
          "field": "variant",
          "valueType": "STRING",
          "id": "800921eb-c745-403a-87ed-a46c062245ff",
          "source": "DEFAULT",
          "fieldType": "Prepago",
          "value": "upsell_2x_loyalty",
          "operator": "=="
        },
        {
          "field": "display_price",
          "valueType": "NUMBER",
          "id": "20b41e97-e6fd-4fc3-9c4b-97eb583d657d",
          "source": "CUSTOMER_PROFILE",
          "fieldType": "Prepago",
          "value": "recharge_mode_1m",
          "operator": ">"
        }
      ]
    ];
    let outputs = await getProducts("srProductCatalogue", contidions);
    if (!outputs || outputs.error) {
      return res.status(404).send();
    }
    res.status(200).send(outputs);
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

// Getting Outputs
router.get("/catalogue/features", async (req, res) => {
  try {
    let catalogue = await Catalogue.find({});
    res.status(200).send(catalogue);
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
    let catalogue = await Catalogue.find({});
    let variables = await Variable.find({});
    let settings = await Setting.find({});

    let data = {
      owners,
      fieldTypes,
      operators,
      outputs,
      trees,
      valueTypes,
      catalogue,
      variables,
      settings
    }
    res.status(200).send(data);
  } catch (e) {
    res.status(500).send();
  }
})
module.exports = router;