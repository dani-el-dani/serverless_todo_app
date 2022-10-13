import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {

  constructor(
    private readonly docClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE) {
  }

  async createTodos(todoItem : TodoItem): Promise<TodoItem> {
    logger.info('Creating todo, from data layer', todoItem.todoId)
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()

    return todoItem
  }

  async getTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Getting todos for user, from data layer', userId)
    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
    
    const items = result.Items
    return items as TodoItem[]
  }
  async deleteTodo(userId: string, todoId: string) {
    logger.info('Deleting todo, from data layer', todoId)
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        'userId' : userId,
        'todoId' : todoId
      },
    }).promise()
  } 
  async updateTodo(userId: string, todoId: string, todoUpdate : TodoUpdate){
    logger.info('Updating todo, from data layer', todoId)
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        'userId' : userId,
        'todoId' : todoId
      },
      UpdateExpression: 'SET #newname = :name, #newdueDate = :dueDate, #newdone = :done',
      ExpressionAttributeValues: {
        ':name' : todoUpdate.name,
        ':dueDate' : todoUpdate.dueDate,
        ':done' : todoUpdate.done
      },
      ExpressionAttributeNames: {
        '#newname' : 'name',
        '#newdueDate' : 'dueDate',
        '#newdone' : 'done'
      }
    }).promise()

  }

}