import { S3 } from 'aws-sdk';
import { BUCKET_NAME } from '../../utils/constants.js';

const s3 = new S3({
    region: 'eu-west-1',
});

export const importFileParser = async (event) => {
    try {
        const { Records } = event;
        for (const record of Records) {
            const { s3: { object: { key } } } = record;
            const response = await s3.getObject({
                Bucket: BUCKET_NAME,
                Key: key
            }).promise();

            const data = response.Body.toString('utf-8');
            console.log('Import parser Lamda result', data);
        }
    } catch (err) {
        console.log(JSON.stringify(err));
    }
};
