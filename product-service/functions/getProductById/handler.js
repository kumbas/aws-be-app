import { getById } from '../../utils/db-client';
import { HEADERS } from '../../utils/constants';

export const getProductById = async (event) => {
	console.log('getProductById lambda event:', JSON.stringify(event));
	try {
        const { pathParameters: { productId } } = event;
        const product = await getById(productId);
		return {
            statusCode: 200,
            headers: HEADERS,
			body: JSON.stringify(product)
		};
	} catch (err) {
        const { statusCode } = err;
		return {
            statusCode: statusCode || 400,
            headers: HEADERS,
			body: JSON.stringify(err)
		};
	}
};
