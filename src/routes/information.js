const express = require("express");
const router = new express.Router();
const Output = require("../models/catalogues/output");
const Catalogue = require("../models/catalogues/catalogue");
const Product = require("../models/catalogues/product");
const csvToJson = require("csvtojson");
const User = require("../models/userData/user");
const Variable = require("../models/catalogues/variable");
const Setting = require("../models/catalogues/setting");
// Getting Test
router.get("/information/createCatalogue", async (req, res) => {
  try {
    let catalogue = new Catalogue({ "key": "bu", "value": "BU", "source": "CUSTOMER_PROFILE", "type": "STRING" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "plan_type", "value": "Plan Type", "source": "CUSTOMER_PROFILE", "type": "STRING" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "status_grp", "value": "STATUS GRP", "source": "CUSTOMER_PROFILE", "type": "STRING" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "in_whitelist_piloto_control", "value": "IN WHITELIST PILOTO CONTROL", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "not_in_whitelist_antidowngrade", "value": "NOT IN WHITELIST ANTIDOWNGRADE", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "active_data_plan_inverse", "value": "Active Data Plan Inverse", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "last_connection", "value": "Last Connection", "source": "CUSTOMER_PROFILE", "type": "DATE" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "fl_optin", "value": "FL Optin", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "user_communication_upsell_benefit", "value": "User Communication Upsell Benefit", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "recharge_mode_1m", "value": "Rechargable Mode 1m", "source": "CUSTOMER_PROFILE", "type": "NUMBER" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "fl_point_to_target", "value": "FL Point to Target", "source": "CUSTOMER_PROFILE", "type": "NUMBER" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "user_communication_2x_loyalty", "value": "User Communication 2X Loyalty", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "user_communication_upsell", "value": "User Communication Upsell", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "is_vip1_product_user", "value": "IS VIP USER", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "user_communication_data_recommender_not_vip", "value": "User Communication Data Recommended No VIP", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "user_communication_data_recommender_vip", "value": "User Communication Data Recommended VIP", "source": "CUSTOMER_PROFILE", "type": "BOOLEAN" });
    await catalogue.save();
    catalogue = new Catalogue({ "key": "model", "value": "Model Upsell", "source": "MODEL", "type": "BOOLEAN" });
    await catalogue.save();

    let catalogueInfo = await Catalogue.find({});
    res.status(200).send(catalogueInfo);
  } catch (e) {
    res.status(500).send();
  }
})

// Getting Test
router.get("/information/createDefinition", async (req, res) => {
  try {
    let output = await Output.findOne({ "key": "PREPAGO" });
    let definition = [
      { "key": "product", "value": "Name", "Product": "PREPAGO", "type": "STRING" },
      { "key": "category_product", "value": "Category Product", "source": "PREPAGO", "type": "STRING" },
      { "key": "category", "value": "Category", "source": "PREPAGO", "type": "STRING" },
      { "key": "category_order", "value": "Category Order", "source": "PREPAGO", "type": "NUMBER" },
      { "key": "variant", "value": "Variant", "source": "PREPAGO", "type": "STRING" },
      { "key": "description", "value": "Description", "source": "PREPAGO", "type": "STRING" },
      { "key": "display_price", "value": "Display Price", "source": "PREPAGO", "type": "NUMBER" },
      { "key": "package_id", "value": "Package Id", "source": "PREPAGO", "type": "NUMBER" },
      { "key": "shortcode", "value": "Short CODE", "source": "PREPAGO", "type": "NUMBER" },
      { "key": "price", "value": "PRICE", "source": "PREPAGO", "type": "NUMBER" },
      { "key": "sms_qty", "value": "SMS QTY", "source": "PREPAGO", "type": "NUMBER" },
      { "key": "sms", "value": "SMS", "source": "PREPAGO", "type": "STRING" },
      { "key": "unlimited_call_tigo", "value": "UNLIMITED CALLS TIGO", "source": "PREPAGO", "type": "BOOLEAN" },
      { "key": "unlimited_call_gt", "value": "UNLIMITED CALLS GT", "source": "PREPAGO", "type": "BOOLEAN" },
      { "key": "total_min", "value": "Total Min", "source": "PREPAGO", "type": "NUMBER" },
      { "key": "gb", "value": "GB", "source": "PREPAGO", "type": "NUMBER" },
      { "key": "mb", "value": "MB", "source": "PREPAGO", "type": "NUMBER" },
      { "key": "total_gb", "value": "Total GB", "source": "PREPAGO", "type": "NUMBER" },
      { "key": "total_mb", "value": "Total MB", "source": "PREPAGO", "type": "NUMBER" },
      { "key": "vas_id", "value": "VAS ID", "source": "PREPAGO", "type": "STRING" },
      { "key": "validity_dys", "value": "Validity DYs", "source": "PREPAGO", "type": "NUMBER" },
      { "key": "guaranteed_apps_spotify", "value": "SPOTIFY", "source": "PREPAGO", "type": "BOOLEAN" },
      { "key": "guaranteed_apps_deezer", "value": "DEEZER", "source": "PREPAGO", "type": "BOOLEAN" },
      { "key": "guaranteed_apps_amazon_music", "value": "AMAZON MUSIC", "source": "PREPAGO", "type": "BOOLEAN" },
      { "key": "guaranteed_apps_whatsapp", "value": "WHATSAPP", "source": "PREPAGO", "type": "BOOLEAN" },
      { "key": "guaranteed_apps_facebook", "value": "FACEBOOK", "source": "PREPAGO", "type": "BOOLEAN" },
      { "key": "guaranteed_apps_facebook_video", "value": "FB VIDEO", "source": "PREPAGO", "type": "BOOLEAN" },
      { "key": "guaranteed_apps_instagram", "value": "INSTAGRAM", "source": "PREPAGO", "type": "BOOLEAN" },
      { "key": "guaranteed_apps_tiktok", "value": "TIKTOK", "source": "PREPAGO", "type": "BOOLEAN" },
      { "key": "guaranteed_apps_youtube", "value": "YOUTUBE", "source": "PREPAGO", "type": "BOOLEAN" },
      { "key": "guaranteed_apps_waze", "value": "WAZE", "source": "PREPAGO", "type": "BOOLEAN" },
      { "key": "guaranteed_apps_gaming", "value": "GAMING", "source": "PREPAGO", "type": "BOOLEAN" },
      { "key": "mi_tigo_code", "value": "Mi Tigo Code", "source": "PREPAGO", "type": "NUMBER" },

    ]
    output.definition = definition;
    await output.save();

    let outputs = await Output.find({});
    res.status(200).send(outputs);
  } catch (e) {
    res.status(500).send();
  }
})

// Getting Test
router.get("/information/crearUsuarios", async (req, res) => {
  try {
    const csvFilePath = 'users_900k_2.csv';

    const json = await csvToJson().fromFile(csvFilePath);

    await Promise.all(json.slice(0, 1000).map(async (element) => {
      let user = new User({ "msisdn": element.msisdn, "data": element });
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

// Getting Test
router.get("/information/crearProductos", async (req, res) => {
  try {
    const csvFilePath = 'product_catalog.csv';

    const json = await csvToJson().fromFile(csvFilePath);

    await Promise.all(json.map(async (element) => {
      let product = new Product({ "type": 'PREPAGO', "data": element });
      await product.save();
    })).then((values) => {
      console.log(values);
    });

    let products = await Product.find({});
    res.status(200).send(products);
  } catch (e) {
    res.status(500).send();
  }
})

// Getting Test
router.get("/information/crearVariables", async (req, res) => {
  try {
    let variable = new Variable({ "key": "promo_day", "value": "Promo Day", "type": "STRING" });
    await variable.save();
    variable = new Variable({ "key": "model_upsell_loyalty", "value": "Model Upsell Loyalty", "type": "STRING" });
    await variable.save();
    variable = new Variable({ "key": "model_upsell_no_loyalty", "value": "Model Upsell No Loyalty", "type": "STRING" });
    await variable.save();
    variable = new Variable({ "key": "tyt_rec_seller_id", "value": "TYT Rec Seller Id", "type": "STRING" });
    await variable.save();
    variable = new Variable({ "key": "tyt_rec_amount", "value": "TYT Rec Amount", "type": "NUMBER" });
    await variable.save();

    let variables = await Variable.find({});
    res.status(200).send(variables);
  } catch (e) {
    res.status(500).send();
  }
})

// Getting Test
router.get("/information/crearSettings", async (req, res) => {
  try {
    let setting = new Setting({ "key": "min_p", "value": "Min P", "type": "NUMBER", "defaultValue": 1 });
    await setting.save();
    setting = new Setting({ "key": "campaigns_per_user", "value": "Campaings x User", "type": "NUMBER", "defaultValue": 1 });
    await setting.save();
    setting = new Setting({ "key": "order", "value": "Order", "type": "NUMBER", "defaultValue": 1 });
    await setting.save();
    setting = new Setting({ "key": "max_same_product_per_user", "value": "Max Same Product x User", "type": "NUMBER", "defaultValue": 1 });
    await setting.save();
    setting = new Setting({ "key": "store", "value": "Store", "type": "BOOLEAN", "defaultValue": true });
    await setting.save();
    setting = new Setting({ "key": "process_stats", "value": "Process Stats", "type": "BOOLEAN", "defaultValue": true });
    await setting.save();
    setting = new Setting({ "key": "notify_owner", "value": "Notify Owner", "type": "BOOLEAN", "defaultValue": true });
    await setting.save();
    setting = new Setting({ "key": "active", "value": "Active", "type": "BOOLEAN", "defaultValue": true });
    await setting.save();


    let settings = await Setting.find({});
    res.status(200).send(settings);
  } catch (e) {
    res.status(500).send();
  }
})

module.exports = router;