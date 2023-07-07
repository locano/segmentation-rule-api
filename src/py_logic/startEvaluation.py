import asyncio
import boto3
import csv
import time
import json
import random
from evaluation import *

f = open('./src/py_logic/tree.json')
tree = json.load(f)
context_variables = {}

filter_users = [
  {
    "msisdn": 50240704676,
    "bu": "MOBILE",
    "plan_type": "PREPAID MOBILE",
    "status_grp": "ACTIVE",
    "not_in_whitelist_antidowngrade": True,
    "active_data_plan_inverse": True,
    "last_connection": "Mon May 15 00:00:00 CST 2023",
    "fl_optin": True,
    "user_communication_upsell_benefit": True,
    "recharge_mode_1m": 5,
    "fl_point_to_target": 45,
    "user_communication_2x_loyalty": True,
    "user_communication_upsell": True,
    "is_vip1_product_user": False,
    "user_communication_data_recommender_not_vip": False,
    "user_communication_data_recommender_vip": True,
    "is_in_whitelist_piloto": True,
    "dt": 1686073467,
    "write_time": "2023-06-06 17:50:49.620",
    "api_invocation_time": "2023-06-06 17:45:51.000",
    "is_deleted": False
  },
  {
    "msisdn": 50247928439,
    "bu": "MOBILE",
    "plan_type": "PREPAID MOBILE",
    "status_grp": "ACTIVE",
    "not_in_whitelist_antidowngrade": True,
    "active_data_plan_inverse": True,
    "last_connection": "Mon May 15 00:00:00 CST 2023",
    "fl_optin": True,
    "user_communication_upsell_benefit": True,
    "recharge_mode_1m": 5,
    "fl_point_to_target": 30,
    "user_communication_2x_loyalty": True,
    "user_communication_upsell": True,
    "is_vip1_product_user": False,
    "user_communication_data_recommender_not_vip": False,
    "user_communication_data_recommender_vip": False,
    "is_in_whitelist_piloto": True,
    "dt": 1686073467,
    "write_time": "2023-06-06 17:50:49.623",
    "api_invocation_time": "2023-06-06 17:45:51.000",
    "is_deleted": False
  },
  {
    "msisdn": 50230998715,
    "bu": "MOBILE",
    "plan_type": "PREPAID MOBILE",
    "status_grp": "ACTIVE",
    "not_in_whitelist_antidowngrade": True,
    "active_data_plan_inverse": False,
    "last_connection": "Mon May 15 00:00:00 CST 2023",
    "fl_optin": True,
    "user_communication_upsell_benefit": True,
    "recharge_mode_1m": 50,
    "fl_point_to_target": 0,
    "user_communication_2x_loyalty": True,
    "user_communication_upsell": True,
    "is_vip1_product_user": False,
    "user_communication_data_recommender_not_vip": True,
    "user_communication_data_recommender_vip": True,
    "is_in_whitelist_piloto": True,
    "dt": 1686073467,
    "write_time": "2023-06-06 17:50:49.628",
    "api_invocation_time": "2023-06-06 17:45:51.000",
    "is_deleted": False
  },
  {
    "msisdn": 50246588556,
    "bu": "MOBILE",
    "plan_type": "PREPAID MOBILE",
    "status_grp": "ACTIVE",
    "not_in_whitelist_antidowngrade": True,
    "active_data_plan_inverse": True,
    "last_connection": "Mon May 15 00:00:00 CST 2023",
    "fl_optin": True,
    "user_communication_upsell_benefit": True,
    "recharge_mode_1m": 5,
    "fl_point_to_target": 30,
    "user_communication_2x_loyalty": True,
    "user_communication_upsell": False,
    "is_vip1_product_user": False,
    "user_communication_data_recommender_not_vip": True,
    "user_communication_data_recommender_vip": True,
    "is_in_whitelist_piloto": True,
    "dt": 1686073467,
    "write_time": "2023-06-06 17:50:49.628",
    "api_invocation_time": "2023-06-06 17:45:51.000",
    "is_deleted": False
  },
  {
    "msisdn": 50232388797,
    "bu": "MOBILE",
    "plan_type": "PREPAID MOBILE",
    "status_grp": "ACTIVE",
    "not_in_whitelist_antidowngrade": True,
    "active_data_plan_inverse": False,
    "last_connection": "Mon May 15 00:00:00 CST 2023",
    "fl_optin": True,
    "user_communication_upsell_benefit": True,
    "recharge_mode_1m": 50,
    "fl_point_to_target": 40,
    "user_communication_2x_loyalty": True,
    "user_communication_upsell": True,
    "is_vip1_product_user": False,
    "user_communication_data_recommender_not_vip": True,
    "user_communication_data_recommender_vip": True,
    "is_in_whitelist_piloto": True,
    "dt": 1686073467,
    "write_time": "2023-06-06 17:50:49.628",
    "api_invocation_time": "2023-06-06 17:45:51.000",
    "is_deleted": False
  }
]

evaluate_sresf(tree,context_variables,filter_users)