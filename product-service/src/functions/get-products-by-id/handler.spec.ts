import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { mock } from 'jest-mock-extended';
import { main as getProductsById } from './handler';

jest.mock(
  '@assets/products.json',
  () => [{
    id: 'product-id',
    title: 'product title',
    price: 7.5,
  }],
  { virtual: true },
);

describe('getProductsById lambda function', () => {
  const context = {} as Context;

  it('Should return product', async () => {
    const mockEvent = mock<APIGatewayEvent>();
    mockEvent.pathParameters = {
      productId : 'product-id',
    };

    const expectedProduct = {
      id: 'product-id',
      title: 'product title',
      price: 7.5,
    };
    const {
      body,
      statusCode,
    } : APIGatewayProxyResult = await getProductsById(mockEvent, context);

    expect(statusCode).toEqual(200);
    expect(JSON.parse(body)).toEqual(expectedProduct);
  });

  it('Should return 404 error if product not found', async () => {
    const productId = 'wrong-product-id';
    const mockEvent = mock<APIGatewayEvent>();
    mockEvent.pathParameters = {
      productId,
    };

    const {
      body,
      statusCode,
    } : APIGatewayProxyResult = await getProductsById(mockEvent, context);

    expect(statusCode).toEqual(404);
    expect(JSON.parse(body)).toEqual({
      error: `Product with ID ${productId} not found.`
    });
  });

  it('Should return 500 error', async () => {
    const event = {} as APIGatewayEvent; // simulate error case - no pathParameters
    const expectedError = {};
    const res: APIGatewayProxyResult = await getProductsById(event, context);

    expect(res.statusCode).toEqual(500);
    expect(JSON.parse(res.body)).toEqual(expectedError);
  });
});
