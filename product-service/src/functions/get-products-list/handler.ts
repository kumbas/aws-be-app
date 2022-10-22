import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import productsList from '@assets/products.json';

const getProductsList: APIGatewayProxyHandler = async () => {
  try {
    return formatJSONResponse(productsList);
  } catch (error) {
    return formatJSONResponse(error, 500);
  }
};

export const main = middyfy(getProductsList);
