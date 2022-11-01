import type { AWS } from '@serverless/typescript';
import importProductsFile from '@functions/import-products-file';

const serverlessConfiguration: AWS = {
  service: 'import-service',
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
      BUCKET_NAME: '${env:BUCKET_NAME}',
      BUCKET_REGION: '${env:BUCKET_REGION}',
      BUCKET_CSV_FOLDER: '${env:BUCKET_CSV_FOLDER}'
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 's3:ListBucket',
            Resource: [
              'arn:aws:s3:::${self:provider.environment.BUCKET_NAME}'
            ]
          },
          {
            Effect: 'Allow',
            Action: 's3:*',
            Resource: [
              'arn:aws:s3:::${self:provider.environment.BUCKET_NAME}/*'
            ]
          }
        ],
      },
    },
  },
  functions: { importProductsFile },
  useDotenv: true,
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
};

module.exports = serverlessConfiguration;
