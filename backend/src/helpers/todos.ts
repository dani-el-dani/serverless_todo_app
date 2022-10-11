import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()
const logger = createLogger('Todos')

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userid: string
): Promise<TodoItem> {
  const itemId = uuid.v4()
  const userId = userid
  const attachmentUrl = attachmentUtils.getAttachmentUrl(itemId)
  logger.info('Creating todo, from business logic', itemId)

  return await todosAccess.createTodos({
    userId: userId,
    todoId: itemId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    attachmentUrl: attachmentUrl
  })
}
export async function getTodosForUser(
  userid: string
): Promise<TodoItem[]> {
  logger.info('Getting todos for user, from business logic', userid)
  return await todosAccess.getTodos(userid)
}
export async function deleteTodo(
  userid: string,
  todoId: string
){
  logger.info('Deleting todo, from business logic', todoId)
  await todosAccess.deleteTodo(userid, todoId)
}
export async function updateTodo(
  userid: string,
  todoId: string,
  updateTodoRequest: UpdateTodoRequest
){
  logger.info('Updating todo, from business logic', todoId)
  await todosAccess.updateTodo(userid, todoId, {
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done,
  })
}
export function createAttachmentPresignedUrl(todoId: string){
	return attachmentUtils.getUploadUrl(todoId)
}