import { S3, SQS } from 'aws-sdk';
import { BUCKET_NAME, REGION } from '../../utils/constants.js';

const s3 = new S3({
    region: REGION,
});

const sqs = new SQS({
    region: REGION,
});

const parseCsvContent = (content) => {
    const productsRows = content.split(/\r?\n|\r/);
    const products = productsRows
        .filter(row => row.length > 0)
        .map(productRow => {
            const productProperties = productRow.split(',');
            return {
                description: productProperties[0],
                price: +productProperties[1],
                title: productProperties[2],
                count: +productProperties[3]
            };
        });
    return products;
}

export const importFileParser = async (event) => {
    try {
        const { Records } = event;
        for (const record of Records) {
            const { s3: { object: { key } } } = record;
            const response = await s3.getObject({
                Bucket: BUCKET_NAME,
                Key: key
            }).promise();

            const products = parseCsvContent(response.Body.toString('utf-8'));
            const messages = products.map(product => {
                return sqs.sendMessage({
                    MessageBody: JSON.stringify(product),
                    QueueUrl: 'https://sqs.us-east-1.amazonaws.com/090571928722/create-product-queue'
                }).promise()
            });
            return Promise.all(messages)
                .then(data => console.log('importFileParser message sent:', JSON.stringify(data)))
                .catch(err => console.log('importFileParser message send error:', JSON.stringify(err)));
        }
    } catch (err) {
        console.log(JSON.stringify(err));
        return err;
    }
};
