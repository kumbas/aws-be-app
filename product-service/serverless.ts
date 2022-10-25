import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/get-products-list';
import getProductsById from '@functions/get-products-by-id';
import createProduct from '@functions/create-product';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    stage: 'sat',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCT_TABLE_NAME: '${env:PRODUCT_TABLE_NAME}',
      STOCK_TABLE_NAME: '${env:STOCK_TABLE_NAME}',
      DB_REGION: '${env:DB_REGION}',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem'
        ],
        Resource: [
          'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.PRODUCT_TABLE_NAME}',
          'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.STOCK_TABLE_NAME}'
        ]
      }
    ],
  },
  functions: { getProductsList, getProductsById, createProduct },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  useDotenv: true,
};

module.exports = serverlessConfiguration;
