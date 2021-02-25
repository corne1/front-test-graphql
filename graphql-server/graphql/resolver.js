const Todo = require('../models/todo');

module.exports = {
  async getTodos() {
    try {
      return await Todo.findAll() 
    } catch (e) {
      throw new Error('Server error');
    }
  },

  async createTodo({todo}) {
    try {
      return await Todo.create({
        title: todo.title,
        done: false
      })
    } catch (e) {
      throw new Error('Server error');
    }
  },

  async deleteTodo({id}) {
    try {
      const todos = await Todo.findAll({
        where: {id}
      });

      await todos[0].destroy();
      return true
    } catch (e) {
      throw new Error('Server error')
    }
  },

  async completeTodo({id}) {
    try {
      const todo = await Todo.findByPk(id);
      todo.done = true;
      await todo.save();
      return todo;
    } catch (e) {
      throw new Error('Server error')
    }
  }
}