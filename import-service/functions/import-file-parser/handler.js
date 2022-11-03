'use strict';
import AWS from 'aws-sdk';
import csv from 'csv-parser';

const BUCKET_NAME = 'shop-product-files';

export const importFileParser = async (event) => {
    console.log('Lambda start: importProductsFile', event);

    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    };

    try {
        const s3 = new AWS.S3({
            region: 'us-east-1',
        });

        for (const record of event.Records) {
            const s3Stream = s3
                .getObject({
                    Bucket: BUCKET_NAME,
                    Key: record.s3.object.key,
                })
                .createReadStream();

            await new Promise((resolve, reject) => {
                s3Stream
                    .pipe(csv())
                    .on('data', (data) => {
                        console.log(
                            'Lambda importProductsFile csv data:',
                            data,
                        );
                    })
                    .on('error', (error) => {
                        reject(error);
                    })
                    .on('end', () => {
                        resolve();
                    });
            });

            await s3
                .copyObject({
                    Bucket: BUCKET_NAME,
                    CopySource: `${BUCKET_NAME}/${record.s3.object.key}`,
                    Key: record.s3.object.key.replace('uploaded', 'parsed'),
                })
                .promise();

            await s3
                .deleteObject({
                    Bucket: BUCKET_NAME,
                    Key: record.s3.object.key,
                })
                .promise();
        }

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