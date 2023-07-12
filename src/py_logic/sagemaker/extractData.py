import boto3
import json
from boto3.dynamodb.types import TypeDeserializer

client_sagemaker = boto3.client('sagemaker')
client_dynamo = boto3.client('dynamodb')
client_glue = boto3.client('glue')


def describe_feature_groups(fgs_list):
    fgs_definition = []
    if fgs_list:
        for fg in fgs_list:
            fgs_description = client_sagemaker.describe_feature_group(
                FeatureGroupName=fg.get('FeatureGroupName')
            )
            identifier = fgs_description.get('RecordIdentifierFeatureName')
            event_time = fgs_description.get('EventTimeFeatureName')
            name = fgs_description.get('FeatureGroupName')
            description = fgs_description.get('Description')
            table_name = fgs_description.get('OfflineStoreConfig').get('DataCatalogConfig').get('TableName')
            database = fgs_description.get('OfflineStoreConfig').get('DataCatalogConfig').get('Database')
           
            glue_definition = client_glue.get_table(
                DatabaseName=database,
                Name=table_name
            )
            glue_columns = glue_definition.get('Table').get('StorageDescriptor').get('Columns')
 
            serializer = boto3.dynamodb.types.TypeSerializer()
            glue_columns_des = []
            for colum in glue_columns:
                des = {k: serializer.serialize(v) for k,v in colum.items()}
                glue_columns_des.append({'M':des})

            is_base = False
            if name.split('-')[1].upper() == 'BASE':
                is_base = True
            else:
                is_base = False
                
            domain = name.split('-')[0].upper()
            
            response_item = client_dynamo.put_item(
                TableName='segmentation-engine-config-schemas',
                Item={
                    'schema_name': {'S': 'USER_' + domain +'_SCHEMA'},
                    'schema_category': {'S': name},
                    'identifier': {'S': identifier},
                    'event_time': {'S': event_time},
                    'name': {'S': name},
                    'value':{'S': name},
                    'description': {'S': description},
                    'table_name': {'S': table_name},
                    'definition': {'L': glue_columns_des},
                    'database': {'BOOL': is_base}
                }
            )
    else:
        print('No Feature Groups found')

def lambda_handler(event, context):
    try:
        response_fgs = client_sagemaker.list_feature_groups(
            SortBy='Name',
            SortOrder='Ascending',
            FeatureGroupStatusEquals='Created'
        )
        fgs_list = response_fgs['FeatureGroupSummaries']
        describe_feature_groups(fgs_list)
        next_token = response_fgs.get('NextToken')
    
        while(next_token):
            response_fgs = client_sagemaker.list_feature_groups(
                SortBy='Name',
                SortOrder='Ascending',
                FeatureGroupStatusEquals='Created',
                NextToken=next_token
            )
            fgs_list = response_fgs['FeatureGroupSummaries']
            describe_feature_groups(fgs_list)
            next_token = response_fgs.get('NextToken')
    
    except Exception as e:
        print(e)




