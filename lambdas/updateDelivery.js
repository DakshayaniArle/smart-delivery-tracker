const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

const SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:123456789012:DeliveryNotifications'; // replace with your actual ARN

exports.handler = async (event) => {
  const packageId = event.packageId;

  if (!packageId) {
    return { statusCode: 400, body: 'Missing packageId' };
  }

  const result = await dynamo.get({
    TableName: 'Deliveries',
    Key: { packageId }
  }).promise();

  const item = result.Item;

  if (!item) {
    return { statusCode: 404, body: 'Package not found' };
  }

  if (item.status === 'Delivered') {
    return { statusCode: 200, body: 'Already delivered' };
  }

  const now = new Date();
  const createdAt = new Date(item.createdAt);
  const elapsedHours = (now - createdAt) / (1000 * 60 * 60);

  const distanceCovered = item.avgSpeed * elapsedHours;
  const progress = distanceCovered / item.distance;

  let newStatus = item.status;

  if (progress >= 1) {
    newStatus = 'Delivered';
  } else if (progress >= 0.9) {
    newStatus = 'Out for Delivery';
  } else if (progress >= 0.25) {
    newStatus = 'Shipped';
  } else {
    newStatus = 'Pending';
  }

  if (newStatus !== item.status) {
    await dynamo.update({
      TableName: 'Deliveries',
      Key: { packageId },
      UpdateExpression: 'set #s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': newStatus }
    }).promise();
  }

  // 🔔 Send SNS email when delivered
  if (newStatus === 'Delivered') {
    await sns.publish({
      TopicArn: SNS_TOPIC_ARN,
      Subject: 'Package Delivered!',
      Message: `The package with ID ${packageId} has been successfully delivered.`
    }).promise();
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      packageId,
      status: newStatus
    })
  };
};
