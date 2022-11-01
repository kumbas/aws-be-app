import { formatJSONResponse } from "../../libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { S3 } from 'aws-sdk';
import * as csv from 'csv-parser';

const importFileParser = async (event) => {
    console.log('[Import File Parser lambda] incoming request, event:', event);
    const { BUCKET_NAME, BUCKET_REGION } = process.env;

    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    };

    try {
        const s3 = new S3({ region: BUCKET_REGION });

        for (const record of event.Records) {
            const s3Stream = s3.getObject({
                    Bucket: BUCKET_NAME,
                    Key: record.s3.object.key,
                }).createReadStream();

            await new Promise((resolve, reject) => {
                s3Stream
                    .pipe(csv())
                    .on('data', (data) => {
                        console.log(
                            '[Import File Parser lambda] csv data row:',
                            data,
                        );
                    })
                    .on('error', (error) => {
                        reject(error);
                    })
                    .on('end', () => {
                        resolve(null);
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
        
        return formatJSONResponse(response);
    } catch (error) {
        return formatJSONResponse(error, 500);
    }
};

export const main = middyfy(importFileParser);
