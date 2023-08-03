document.addEventListener('DOMContentLoaded', () => {
    refreshTaskList();
  });
  
  function addTask() {
    const taskInput = document.getElementById('newTask');
    const taskText = taskInput.value.trim();
    if (taskText === '') return;
  
    fetch('/addTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskText }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        refreshTaskList();
      })
      .catch((err) => console.error('Error adding task:', err));
  
    taskInput.value = '';
  }
  
  function deleteTask(index) {
    fetch(`/deleteTask/${index}`, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        refreshTaskList();
      })
      .catch((err) => console.error('Error deleting task:', err));
  }
  
  function refreshTaskList() {
    const taskListDiv = document.getElementById('taskList');
    taskListDiv.innerHTML = '';
  
    fetch('/tasks')
      .then((res) => res.json())
      .then((data) => {
        data.tasks.forEach((task, index) => {
          const taskDiv = document.createElement('div');
          taskDiv.classList.add('task');
  
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = task.completed;
          checkbox.addEventListener('change', () => {
            updateTaskCompletion(index, checkbox.checked);
          });
  
          const taskTextElement = document.createElement('span');
          taskTextElement.textContent = task.text;
          if (task.completed) {
            taskTextElement.classList.add('completed');
          }
  
          const deleteButton = document.createElement('span');
          deleteButton.classList.add('delete-task');
          deleteButton.textContent = '✕';
          deleteButton.addEventListener('click', () => {
            deleteTask(index);
          });
  
          taskDiv.appendChild(checkbox);
          taskDiv.appendChild(taskTextElement);
          taskDiv.appendChild(deleteButton);
  
          taskListDiv.appendChild(taskDiv);
        });
      })
      .catch((err) => console.error('Error fetching tasks:', err));
  }
  
  function updateTaskCompletion(index, completed) {
    fetch(`/updateTask/${index}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        refreshTaskList();
      })
      .catch((err) => console.error('Error updating task:', err));
  }
  