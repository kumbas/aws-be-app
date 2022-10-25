import { APIGatewayProxyHandler } from 'aws-lambda';
import AWS from 'aws-sdk';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const { DB_REGION, PRODUCT_TABLE_NAME, STOCK_TABLE_NAME } = process.env;
AWS.config.update({ region: DB_REGION });
const dynamo = new AWS.DynamoDB.DocumentClient();

const query = async (productId: string) => {
  const productResult = await dynamo.query({
    TableName: PRODUCT_TABLE_NAME,
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {':id': productId }
  }).promise();
  const stockResult = await dynamo.query({
    TableName: STOCK_TABLE_NAME,
    KeyConditionExpression: 'product_id = :product_id',
    ExpressionAttributeValues: {':product_id': productId }
  }).promise();

  const [product] = productResult.Items;
  const [stock] = stockResult.Items;

  return product ? {
    ...product,
    count: stock?.count || 0,
  } : null;
}

const getProductsById: APIGatewayProxyHandler = async (event) => {
  try {
    const { productId } = event.pathParameters;
    console.log(`GET /products/{product_id} is running. Product ID = ${productId}`);
    const product = await query(productId);

    if (product) {
      return formatJSONResponse(product);
    } else {
      return formatJSONResponse(
      {
        error: `Product with ID ${productId} not found.`,
      },
      404,
      );
    }
  } catch (error) {
    return formatJSONResponse(error, 500);
  }
};

export const main = middyfy(getProductsById);
