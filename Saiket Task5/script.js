let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const count = document.getElementById('count');

function save() { localStorage.setItem('tasks', JSON.stringify(tasks)); }

function render() {
  taskList.innerHTML = '';
  let filtered = tasks.filter(t => {
    if(filter==='active') return!t.completed;
    if(filter==='completed') return t.completed;
    return true;
  });

  filtered.forEach((t, index) => {
    const realIndex = tasks.indexOf(t);
    const li = document.createElement('li');
    li.className = `task ${t.completed? 'completed' : ''}`;
    li.innerHTML = `
      <input type="checkbox" ${t.completed? 'checked' : ''} onchange="toggle(${realIndex})">
      <span ondblclick="editTask(${realIndex})">${t.text}</span>
      <div class="actions">
        <button class="edit" onclick="editTask(${realIndex})">Edit</button>
        <button class="delete" onclick="deleteTask(${realIndex})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  count.textContent = `${tasks.filter(t=>!t.completed).length} tasks left`;
}

function addTask() {
  const text = taskInput.value.trim();
  if(!text) return alert('Please enter a task');
  tasks.push({ text, completed:false });
  taskInput.value = '';
  save(); render();
}

function toggle(i) { tasks[i].completed =!tasks[i].completed; save(); render(); }

function deleteTask(i) { tasks.splice(i,1); save(); render(); }

function editTask(i) {
  const newText = prompt('Edit task:', tasks[i].text);
  if(newText!== null && newText.trim()!== '') {
    tasks[i].text = newText.trim();
    save(); render();
  }
}

addBtn.onclick = addTask;
taskInput.addEventListener('keypress', e => { if(e.key==='Enter') addTask(); });

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  };
});

document.getElementById('clearBtn').onclick = () => {
  tasks = tasks.filter(t=>!t.completed);
  save(); render();
};

render();