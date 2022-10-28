import bodySchema from './body-schema';

export default {
    type: 'object',
    properties: {
        body: bodySchema
    }
} as const;
