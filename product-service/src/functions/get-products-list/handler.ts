import { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import { formatJSONResponse } from '@libs/api-gateway';
import { innerJoin } from '@libs/join';
import { middyfy } from '@libs/lambda';

const { DB_REGION, PRODUCT_TABLE_NAME, STOCK_TABLE_NAME } = process.env;
AWS.config.update({ region: DB_REGION });
const dynamo = new AWS.DynamoDB.DocumentClient();

const scan = async () => {
  const productResult = await dynamo.scan({
    TableName: PRODUCT_TABLE_NAME
  }).promise();
  const stockResult = await dynamo.scan({
    TableName: STOCK_TABLE_NAME
  }).promise();

  return innerJoin(
    productResult.Items,
    stockResult.Items,
    'id',
    'product_id',
    (
      {id, title, description, price, img},
      {count},
    ) => ({id, title, description, price, img, count}),
  );
};

const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    console.log('GET /products is running');
    const productsList = await scan();
    return formatJSONResponse(productsList);
  } catch (error) {
    return formatJSONResponse(error, 500);
  }
};

export const main = middyfy(getProductsList);
