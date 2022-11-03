'use strict';
import AWS from 'aws-sdk';

const BUCKET_NAME = 'shop-product-files';
const BUCKET_CSV_FOLDER = 'uploaded';

export const importProductsFile = async (event) => {
    console.log(
        'Lambda start: importProductsFile:',
        event,
    );

    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    };

    try {
        const fileName = event?.queryStringParameters?.name;
        const s3 = new AWS.S3({
            region: 'us-east-1',
        });
        const filePath = `${BUCKET_CSV_FOLDER}/${fileName}`;

        const params = {
            Bucket: BUCKET_NAME,
            Key: filePath,
            Expires: 60,
            ContentType: 'text/csv',
        };

        const signedUrl = await s3.getSignedUrlPromise('putObject', params);
        response.body = signedUrl;

        return response;
    } catch (err) {
        console.error('error', err);

        response.statusCode = 500;
        response.body = JSON.stringify({
            message: 'Internal error',
        });

        return response;
    }
};