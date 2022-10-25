import { handlerPath } from '@libs/handler-resolver';
import bodySchema from './body-schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        request: {
          schemas: {
            'application/json': bodySchema,
          },
        },
        cors: true,
      },
    },
  ],
};