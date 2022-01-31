import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos' 
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id

    const userId = getUserId(event)

     const todoDeleted = await deleteTodo(userId, todoId)

     if (todoDeleted){

       return {
        statusCode: 204,
        headers: {
      'Access-Control-Allow-Origin': '*'
     
    },
    body: JSON.stringify({
        message: "Todo deleted successfully."
      })
     }

     }


     return {
        statusCode: 500,
        headers: {
      'Access-Control-Allow-Origin': '*'
      
    },
    body: JSON.stringify({
        message: "Unable to delete Todo record."
      })
  }
    
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
