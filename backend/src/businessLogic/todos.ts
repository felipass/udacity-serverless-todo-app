import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils'; //./attachmentUtils
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic


//import {getUserId } from '../lambda/utils'
const logger = createLogger('todos')

const todoAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function getAllTodos(): Promise<TodoItem[]> {
  return todoAccess.getAllTodos()
}

export async function createTodo(createTodoRequest: CreateTodoRequest,userId: string): Promise<TodoItem> {

  const todoId = uuid.v4()
  //const userId = getUserId(jwtToken)
   logger.info('creating todo for user:', { 'info':userId })

   
try {

   return await todoAccess.createTodo({

     userId: userId,
     todoId: todoId,
     createdAt: new Date().toISOString(),
      ...createTodoRequest,
    attachmentUrl: null,
    done:false
  })


} catch(e){

  logger.error('Todo creation failed', { error: e.message })

}
  

 
 

}



export async function updateTodo(updateTodoRequest: UpdateTodoRequest, userId: String,todoId: string):Promise<Boolean> {

    

     logger.info('updating todo:', { 'info':todoId })
  try{

  return  await todoAccess.updateTodo({
     
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done:updateTodoRequest.done
  },userId,todoId)

  

 } catch(e){

  logger.error('Todo update failed', { error: e.message })

  } 
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {

   try{

      return todoAccess.getTodosForUser(userId)

  } catch(e){

    logger.error('Get todo for user failed', { error: e.message })
    

  } 
   
 
}



export async function createAttachmentPresignedUrl(userId: string, todoId: string,attachmentUrl: string): Promise<Boolean>{

  try {

  return await todoAccess.createAttachmentPresignedUrl(userId, todoId,attachmentUrl)

} catch(e){

    logger.error('Creating attachment failed', { error: e.message })
  
  } 
}


export  function getUploadUrl(todoId: string){

  try {

  
   return attachmentUtils.getUploadUrl(todoId)
   }
   catch(e){

      logger.error('url failed', { error: e.message })
      return   createError(400, 'Bad Request', { error: e.message })

  } 

}



export async function deleteTodo(userId: string, todoId: string) : Promise<Boolean>{

  try{

     return await todoAccess.deleteTodo(userId, todoId)

  } catch(e){

    logger.error('Deleting todo failed', { error: e.message })
     createError(400, 'Bad Request', { error: e.message })

  } 
   
}







