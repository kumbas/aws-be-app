import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser())
}

export const middyfyValidate = (handler, schema) => {
  return middy(handler)
    .use(middyJsonBodyParser())
    .use(
      validator({
        inputSchema: schema,
      })
    )
    .use(httpErrorHandler());
}
