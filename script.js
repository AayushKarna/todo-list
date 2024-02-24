'use strict';

const addTodoForm = document.getElementById('add-todo-form');
const todosContainer = document.getElementById('todos-container');
const completedTodoFigure = document.getElementById('completed-figure');
const totalTodoFigure = document.getElementById('total-figure');
const percentageTodoFigure = document.getElementById('percentage-figure');
const clearListBtn = document.getElementById('clear-list-btn');

const todos = JSON.parse(localStorage.getItem('todos')) || [];

const saveTodosInLocalStorage = function () {
  localStorage.setItem('todos', JSON.stringify(todos));
};

const renderStats = function () {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.isDone).length;
  const percentage = (completedTodos / totalTodos) * 100 || 0;

  totalTodoFigure.textContent = totalTodos;
  completedTodoFigure.textContent = completedTodos;
  percentageTodoFigure.textContent = `${percentage.toFixed(2)}%`;
};

const renderAllTodos = function () {
  todosContainer.innerHTML = '';

  renderStats();

  if (todos.length === 0) {
    const noTodoElement = document.createElement('li');
    noTodoElement.classList.add('no-todo');
    noTodoElement.textContent = 'No Todo 💪';
    todosContainer.append(noTodoElement);
    return;
  }

  todos.forEach(todo => {
    const todoItemElemet = document.createElement('li');
    todoItemElemet.innerHTML = `
      <input type="checkbox" id="todo-${todo.id}" ${
      todo.isDone ? 'checked' : ''
    } />
      <label for="todo-${todo.id}">${todo.name}</label>
      <button class="btn btn-danger" data-id="${todo.id}">Delete</button>
    `;

    todosContainer.append(todoItemElemet);
  });
};

addTodoForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const todoName = e.target.todo.value;

  if (!todoName.trim()) return;

  const todo = {
    id: `${Date.now()}`.slice(-10),
    name: todoName,
    isDone: false
  };

  if (todos.length === 0) {
    todosContainer.querySelector('.no-todo').remove();
  }

  todos.push(todo);

  saveTodosInLocalStorage();

  renderAllTodos();

  e.target.reset();
});

todosContainer.addEventListener('click', function (e) {
  if (e.target.tagName !== 'BUTTON') return;

  const todoId = e.target.dataset.id;

  const todoIndex = todos.findIndex(todo => todo.id === todoId);

  if (todoIndex === -1) return;

  todos.splice(todoIndex, 1);

  saveTodosInLocalStorage();

  renderAllTodos();
});

todosContainer.addEventListener('change', function (e) {
  if (e.target.tagName !== 'INPUT') return;

  const todoId = e.target.id.split('-')[1];

  const todoIndex = todos.findIndex(todo => todo.id === todoId);

  if (todoIndex === -1) return;

  todos[todoIndex].isDone = e.target.checked;

  saveTodosInLocalStorage();

  renderStats();
});

clearListBtn.addEventListener('click', function () {
  if (!confirm('Are you sure you want to delete all todos?')) return;

  todos.length = 0;

  saveTodosInLocalStorage();

  renderAllTodos();
});

renderAllTodos();
