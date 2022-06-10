const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid')

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
}

function checksExistsUsername(request, response, next){
  const {name, username} = request.body
  const isUsernameAlreadyUsed = users.find((user) => user.username = username)
  if(isUsernameAlreadyUsed){
    return response.status(400).json({error: "Username is already used"})
  }
  request.user = {
    name,
    username,
  }
  return next()
}

app.post('/users', checksExistsUsername, (request, response) => {
  const { user } = request
  const newUser = {
    id: uuidv4(),
    name: user.name,
    username: user.username,
    todos: []
  }

  users.push(newUser)
  
  response.send(newUser)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;