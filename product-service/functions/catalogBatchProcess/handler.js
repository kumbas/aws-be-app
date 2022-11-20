import { SNS } from 'aws-sdk';
import { createProduct } from '../createProduct/handler.js';

const sns = new SNS({
    region: 'us-east-1',
});

export const catalogBatchProcess = async (event) => {
	console.log('catalogBatchProcess lambda event:', JSON.stringify(event));

	try {
        const requests = event.Records.map(record => {
            return createProduct({
                body: record.body
            })
                .then(async (data) => {
                    if (data.statusCode !== 200) {
                        console.log('catalogBatchProcess failed to createProduct:', result);
                        return;
                    }
                    await sns.publish({
                        Subject: 'Product created',
                        Message: `The product with properties ${record.body} successfully created`,
                        TopicArn: 'arn:aws:sqs:us-east-1:090571928722:create-product-queue'
                    }).promise();
                    console.log('catalogBatchProcess createProduct result:', data);
                });
        });
        return Promise.all(requests)
            .then(data => console.log('catalogBatchProcess products created:', JSON.stringify(data)))
            .catch(err => console.log('catalogBatchProcess products create error:', JSON.stringify(err)));
	} catch (err) {
		console.log('catalogBatchProcess error:', JSON.stringify(err));
        return err;
	}
};