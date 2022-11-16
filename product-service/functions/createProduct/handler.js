import { create } from '../../utils/db-client';
import { HEADERS } from '../../utils/constants';

function validatePrice(price) {
    if (typeof price !== 'number' || price <= 0) {
        throw new Error('Invalid product price');
    }
}

function validateCount(count) {
    if (typeof count !== 'number' || count <= 0) {
        throw new Error('Invalid product count');
    }
}

function validateTitle(title) {
    if (typeof title !== 'string' || title.length === 0) {
        throw new Error('Invalid product title');
    }
}

function validateDescription(description) {
    if (typeof description !== 'string' || description.length === 0) {
        throw new Error('Invalid product description');
    }
}

function validateImg(img) {
    if (typeof description !== 'string' || description.length === 0) {
        throw new Error('Invalid product image');
    }
}

function validatePayload(payload) {
    const {
        price,
        title,
        count,
        description,
        img
    } = payload;
    validatePrice(price);
    validateCount(count);
    validateTitle(title);
    validateImg(img)
    validateDescription(description);
}

export const createProduct = async (event) => {
    console.log('createProduct lambda event:', JSON.stringify(event));
	try {
		const payload = JSON.parse(event.body);
        validatePayload(payload);
		const product = await create(payload);
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
