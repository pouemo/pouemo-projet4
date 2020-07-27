import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as aws from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Caller event ', event)

  const userId = '1'

  const todos = await getTodos(userId)

  return{
    statusCode:200,
    headers:{
      'Access-Control-Allow-Origin': '*'
    },
    body:JSON.stringify({
      items: todos
    })
  }
}

async function getTodos(userId: string){
  const result = await docClient.query({
    TableName:'todos',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues:{
      ':userId': userId
    },
    ScanIndexForward:false
  }).promise()
  return result.Items
}
