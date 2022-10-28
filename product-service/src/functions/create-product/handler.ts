import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfyValidate } from '@libs/lambda';
import { Product } from '@models/product';
import bodySchema from './body-schema';
import validationSchema from './validation-schema';

const { DB_REGION, PRODUCT_TABLE_NAME, STOCK_TABLE_NAME } = process.env;
AWS.config.update({ region: DB_REGION });
const dynamo = new AWS.DynamoDB.DocumentClient();

const put = async (product: Partial<Product>) => {
  const { count, ...productItem } = product;
  const productId = uuidv4();

  await dynamo.put({
    TableName: PRODUCT_TABLE_NAME,
    Item: {
      ...productItem,
      id: productId
    },
  }).promise();

  await dynamo.put({
    TableName: STOCK_TABLE_NAME,
    Item: {
      product_id: productId,
      count,
    }
  }).promise();

  return {
    ...product,
    id: productId
  };
};

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof bodySchema> = async (event) => {
  try {
    const product = event.body;
    console.log(`POST /products is running. Product body = ${JSON.stringify(product)}`);
    const createdProduct = await put(product);
    return formatJSONResponse(createdProduct);
  } catch (error) {
    return formatJSONResponse(error, 500);
  }
};

export const main = middyfyValidate(createProduct, validationSchema);
