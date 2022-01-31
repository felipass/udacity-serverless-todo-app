import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createTodo } from '../../businessLogic/todos' 
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
   
    // TODO: Implement creating a new TODO item
    

   const userId = getUserId(event)
   const newItem = await createTodo(newTodo, userId)

   const retValue={

     todoId: newItem.todoId,
     createdAt:newItem.createdAt,
     name:newItem.name,
     dueDate:newItem.dueDate,
     done:newItem.done,
     attachmentUrl:newItem.attachmentUrl
   }

    if (newItem.todoId.length !== 0) {

      return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
      
    },
    body: JSON.stringify({
    
     item:retValue
    })
    }

    }

   return {
    statusCode: 500,
    headers: {
      'Access-Control-Allow-Origin': '*'
      
    },
    body: JSON.stringify({
    
      message: "Todo creation failed!."
    })
  }


  })

handler.use(
  cors({
    credentials: true
  })
)
