import { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product } from '@models/product';
import productsList from '@assets/products.json';

const getProductsById: APIGatewayProxyHandler = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product: Product = productsList.find((p: Product) => p.id === productId);

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
