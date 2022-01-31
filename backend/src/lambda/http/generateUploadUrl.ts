import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import {createAttachmentPresignedUrl,getUploadUrl} from  '../../businessLogic/todos' //'../../businessLogic/todos'

 import { getUserId } from '../utils'

//import { S3 } from 'aws-sdk'


const bucketName = process.env.ATTACHMENT_S3_BUCKET 

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
   
    const url =  getUploadUrl(todoId)

   

    const userId = getUserId(event)

    
     const attachmentUrl= `https://${bucketName}.s3.amazonaws.com/${todoId}`
    
     
      const urlUpdated =  await createAttachmentPresignedUrl(userId, todoId,attachmentUrl)

    
    

       if(urlUpdated){
        // console.log(`The value of createAttachmentPresignedUrl is ${urlUpdated}`)
        
         return {
          statusCode: 200,
           headers: {
           'Access-Control-Allow-Origin': '*'
      
          },
          body: JSON.stringify({
            
              uploadUrl:url
        })
         }

       }

      return {
          statusCode: 500,
           headers: {
           'Access-Control-Allow-Origin': '*'
      
          },
          body: JSON.stringify({
                message: `Error creating attachement for ${attachmentUrl}`
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
