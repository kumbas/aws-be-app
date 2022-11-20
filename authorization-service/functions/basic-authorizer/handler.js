const policy = {
    Version: '2012-10-17',
    Statement: [
        {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: ''
        }
    ]
};

export const basicAuthorizer = async (event) => {
    const { authorizationToken, methodArn } = event;
    policy.Statement[0].Resource = methodArn;

    const credentialsEncoded = authorizationToken.replace('Basic ', '');
    const credentialsDecoded = Buffer.from(credentialsEncoded, 'base64').toString('utf-8');
    const [ username, password ] = credentialsDecoded.split(':');

    console.log('username:', username, 'password:', password);

    const isValidUser = process.env[username] === password;

    if (!isValidUser) {
        return {
            principalId: username,
            policyDocument: policy
        }
    }

    policy.Statement[0].Effect = 'Allow';
    return {
        principalId: username,
        policyDocument: policy
    }
};
