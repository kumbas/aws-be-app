import { getAll } from '../../utils/db-client';
import { HEADERS } from '../../utils/constants';

export const getProductsList = async (event) => {
	console.log('getProductsList lambda event:', JSON.stringify(event));
	try {
        const products = await getAll();
		return {
            statusCode: 200,
            headers: HEADERS,
			body: JSON.stringify(products)
		};
	} catch (err) {
		return {
            statusCode: 400,
            headers: HEADERS,
			body: JSON.stringify(err)
		};
	}
};
