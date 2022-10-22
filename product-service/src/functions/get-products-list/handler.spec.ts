import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { main as getProductsList } from './handler';

jest.mock(
  '@assets/products.json',
  () => [{
    id: 'product-id',
    title: 'product title',
    price: 7.5,
  }],
  { virtual: true },
);

describe('getProductsList lambda function', () => {
  it('Should return product list', async () => {
    const event = {} as APIGatewayEvent;
    const context = {} as Context;
    const res: APIGatewayProxyResult = await getProductsList(event, context);
    const expectedProductList = [{
      id: 'product-id',
      title: 'product title',
      price: 7.5,
    }];

    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.body)).toEqual(expectedProductList);
  });
});
