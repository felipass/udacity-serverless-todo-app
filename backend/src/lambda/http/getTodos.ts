import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from  '../../businessLogic/todos' //'../../businessLogic/todos'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    // Write your code here
     const userId = getUserId(event)

     console.log(`user Id is--> : ${userId}`)
     const todos =  await getTodosForUser(userId)
   
    if (todos.length !== 0) {

     return {
       statusCode: 200,
        headers: {
      'Access-Control-Allow-Origin': '*'
      },
       body: JSON.stringify({
      items: todos
     })
    }

    }

    if (todos.length == 0 && userId.length > 0) {

     
      const noTodo=
      [
           {

           "todoId": "",
           "createdAt": "",
           "name": "",
           "dueDate": "",
           "done": false,
           "attachmentUrl": ""
          }

      ]
      
    

      return {
       statusCode: 200,
        headers: {
      'Access-Control-Allow-Origin': '*'
      },
       body: JSON.stringify({
      items: noTodo 
     })
    }

    }




      return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }

  })
  
handler.use(
  cors({
    credentials: true
  })
)
