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

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some(
    (user) => user.username === username
  );

  if (userAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists!" });
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
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

  if(!selectedTodo){
    return response.status(404).json({ error: "Todo doesn't exist" });
  }

  selectedTodo.title = title;
  selectedTodo.deadline = deadline;

  return response.status(201).json(selectedTodo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;
  
  let selectedTodo = user.todos.find(todo => todo.id === id);

  if(!selectedTodo){
    return response.status(404).json({ error: "It's not possible to change non existing todo"});
  }

  selectedTodo.done = true;
  
  return response.status(201).json(selectedTodo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  let selectedTodo = user.todos.find(todo => todo.id === id);

  if(!selectedTodo){
    return response.status(404).json({ error: "It's not possible to delete a non existing todo"});
  }
  
  user.todos.splice(selectedTodo, 1);

  response.status(204).send();
});

module.exports = app;