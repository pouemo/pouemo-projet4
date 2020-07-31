import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOSS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const validTodoId = await todoExists(todoId)

  if (!validTodoId) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Todo does not exist'
      })
    }
  }

  const todo = await deleteTodo(todoId)

  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todo
    })
  }
}

async function todoExists(todoId: string) {
  const result = await docClient
    .get({
      TableName: todosTable,
      Key: {
        todoId: todoId
      }
    })
    .promise()

  console.log('Get todo: ', result)
  return !!result.Item
}

async function deleteTodo(todoId: string) {
  const result = await docClient.delete({
    TableName: todosTable,
    Key: {
      id: todoId
    }
  }).promise()

  return result
}

