import { formatJSONResponse } from "../../libs/api-gateway";
import { APIGatewayProxyHandler } from "aws-lambda";
import { middyfy } from "@libs/lambda";
import { S3 } from 'aws-sdk';

const { BUCKET_NAME, BUCKET_REGION, BUCKET_CSV_FOLDER } = process.env;
const s3 = new S3({ region: BUCKET_REGION });

const importProductsFile: APIGatewayProxyHandler = async (event) => {
    try {
        const { name } = event?.queryStringParameters;
        const params = {
            Bucket: BUCKET_NAME,
            Key: `${BUCKET_CSV_FOLDER}/${name}`,
            Expires: 60,
            ContentType: 'text/csv'
        }
        const url = await s3.getSignedUrlPromise('putObject', params);
        
        return formatJSONResponse(url);
    } catch (error) {
        return formatJSONResponse(error, 500);
    }
};

export const main = middyfy(importProductsFile);
