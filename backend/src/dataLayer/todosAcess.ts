import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

//const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(), //createDynamoDBClient(),
  
    private readonly todoTable = process.env.TODOS_TABLE,
   // private readonly todoIndex = process.env.TODOS_CREATED_AT_INDEX
    ) {
  }


   async getAllTodos(): Promise<TodoItem[]> {

    //console.log('Getting all Todo Items')
     logger.info('Getting all Todo Items', { 'info':'All todo' })

     try{

       const result = await this.docClient.scan({
      TableName: this.todoTable
    }).promise()

    const items = result.Items
    return items as TodoItem[]

    } catch(e){

   logger.error('Get All todo failed', { error: e.message })

  }
   

  }

   async createTodo(todo: TodoItem): Promise<TodoItem> {

     try{

    await this.docClient.put({
      TableName: this.todoTable,
      Item: todo
    }).promise()



    return todo

     } catch(e){

       logger.error('Todo creation failed', { error: e.message })

     }

  }


  async updateTodo(todoUpdate:TodoUpdate,  userId: String,todoId: String):Promise<Boolean>{
   
    let todoUpdated=false
    try{
   
/*
        await this.docClient.update({
      TableName: this.todoTable,
      Key:{
         userId : userId ,
         todoId:todoId
         
      },
      UpdateExpression: "set name = :name, dueDate=:dueDate, done=:done",
      ExpressionAttributeValues:{
        ":name": todoUpdate.name,
        ":dueDate": todoUpdate.dueDate,
        ":done": todoUpdate.done
    }
    ,
    ReturnValues:"UPDATED_NEW"
   

     }).promise()

     */
  await this.docClient.update({
        TableName: this.todoTable,
        Key: {
          userId,
          todoId
        },
        UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
        ExpressionAttributeNames: {
          "#name": "name",
          "#dueDate": "dueDate",
          "#done": "done"

        },
        ExpressionAttributeValues: {
          ":name": todoUpdate.name,
          ":dueDate": todoUpdate.dueDate,
          ":done": todoUpdate.done
        }
      }).promise()


     todoUpdated=true

     // const items = result.Attributes
      return todoUpdated//items as TodoItem[]

      } catch(e){
          todoUpdated=false

       logger.error('Todo update failed', { error: e.message })

     }finally{
        return todoUpdated
     }


   //  return null

  }


  async  getTodosForUser(userId: string): Promise<TodoItem[]> {
      
  try{


  const result = await this.docClient.query({
    TableName: this.todoTable,
   // IndexName : this.todoIndex,
    KeyConditionExpression: '#userId = :uid',
    ExpressionAttributeNames: {
                    '#userId': 'userId'
                },
    ExpressionAttributeValues: {
      ':uid': userId
      
    }
     }).promise()




/*
const result = await this.docClient
.query({
  TableName:  this.todoTable,
  IndexName:  this.todoIndex,
  KeyConditionExpression: 'paritionKey = :paritionKey',
  ExpressionAttributeValues: {
    ':paritionKey': partitionKeyValue
  }
})
.promise()


  

    const result = await this.docClient.scan({
      TableName: this.todoTable
    }).promise()
*/

   const items = result.Items
   return items as TodoItem[]

    } catch(e){

       logger.error(`Todo for user: ${userId} failed`, { error: e.message })

   }

}


async createAttachmentPresignedUrl(userId: string,todoId: string,url: string): Promise<Boolean> {


 let itemUpdated: boolean =false

   try {

    await this.docClient.update({
        TableName: this.todoTable,
        Key: {
          userId,
          todoId
        },
        UpdateExpression: 'set #a = :attachmentUrl',
        ExpressionAttributeNames: {
          "#a": "attachmentUrl"
         

        },
        ExpressionAttributeValues: {
          ":attachmentUrl": url
         
        }
      }).promise()

/*
    await this.docClient.update({
      TableName: this.todoTable,
      Key: { 
         
        userId:userId ,
        todoId:todoId
      },
      ExpressionAttributeNames: {"#a": "attachmentUrl"},
      UpdateExpression: "set #a = :attachmentUrl",
      ExpressionAttributeValues: {
          ":attachmentUrl": attachmentUrl,
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()

    */

    itemUpdated=true
      
    return itemUpdated  

    
    } catch(e){
       itemUpdated=false
       logger.error(`Attachment for todo: ${todoId} failed`, { error: e.message })

   }finally{
      return itemUpdated
   }
  
  }

  async deleteTodo(userId: string, todoId: string): Promise<Boolean> {

     let todoDeleted=false
    try{
       

       await this.docClient.delete({

        TableName: this.todoTable,
        Key:{
          "todoId":todoId,
          "userId" : userId 
        }

       }).promise()

        todoDeleted=true


     } catch(e){

       todoDeleted=false
       logger.error(`Delete todo: ${todoId} failed`, { error: e.message })

   }finally{

      return todoDeleted

   }

   
    
  }

}