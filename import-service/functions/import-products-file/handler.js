import { S3 } from 'aws-sdk';
import { HEADERS, BUCKET_NAME, FOLDER_PATH } from '../../utils/constants.js';

const s3 = new S3({
    region: 'eu-west-1',
});
const BUCKET = BUCKET_NAME;
const BUCKET_FOLDER_PATH = FOLDER_PATH;

export const importProductsFile = async (event) => {
    try {
        const { queryStringParameters: { name } } = event;
        const params = {
            Bucket: BUCKET,
            Key: `${BUCKET_FOLDER_PATH}/${name}`,
            ContentType: 'text/csv'
        }
        const signedUrl = await s3.getSignedUrlPromise('putObject', params);

        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify(signedUrl)
        };
    } catch (err) {
        return {
            statusCode: 400,
            headers: HEADERS,
            body: JSON.stringify(err)
        }
    }
};
