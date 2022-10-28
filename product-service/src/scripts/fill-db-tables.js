/*
How to run:
cd product-service/src/scripts
node fill-db-tables.js
*/

const { v4: uuidv4 } = require('uuid');
const productsList = require('../assets/products.json');

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const dynamo = new AWS.DynamoDB.DocumentClient();

const PRODUCT_TABLE_NAME = 'products';
const STOCK_TABLE_NAME = 'stocks';

const putItems = async (tableName, item) => {
  return await dynamo.put({
    TableName: tableName,
    Item: item
  }).promise();
};

// fill Product and Stock tables based on mocked json data
productsList.map(async (product) => {
  const {
    count,
    description,
    img,
    price,
    title,
  } = product;
  const productId = uuidv4();

  await putItems(PRODUCT_TABLE_NAME, {
    id: productId,
    description,
    img,
    price,
    title,
  });
  await putItems(STOCK_TABLE_NAME, {
    product_id: productId,
    count,
  });
});
