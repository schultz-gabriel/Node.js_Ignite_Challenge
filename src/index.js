const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid')

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(user => user.username = username);
  if(!user){
    return response.status(400).json({error: "User does't exist"});
  }
  request.user = user;
  return next()
}

function checksExistsUsername(request, response, next){
  const { name, username } = request.body;
  const isUsernameAlreadyUsed = users.find((user) => user.username = username);
  if(isUsernameAlreadyUsed){
    return response.status(400).json({error: "Username is already used"})
  }
  request.user = {
    name,
    username,
  };
  return next();
}

app.post('/users', checksExistsUsername, (request, response) => {
  const { user } = request;

  const newUser = {
    id: uuidv4(),
    name: user.name,
    username: user.username,
    todos: []
  };

  users.push(newUser);

  return response.status(201).send(newUser);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  
  return response.status(200).send(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user, body } = request;
  const { title, deadline } = body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  user.todos.push(newTodo);

  return response.status(201).send(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  let selectedTodo = user.todos.find(todo => todo.id == id);
  selectedTodo = { ...selectedTodo, title, deadline };

  return response.send(selectedTodo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { done } = request.body;
  
  let selectedTodo = user.todos.find(todo => todo.id == id);
  selectedTodo.done = done;
  
  return response.status(204).send(selectedTodo)});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;