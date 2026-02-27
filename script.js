const input = document.getElementById('todoInput');
const category = document.getElementById('categorySelect');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('todoList');
const empty = document.getElementById('emptyState');
const totalSpan = document.getElementById('totalTasks');
const doneSpan = document.getElementById('completedTasks');
const leftSpan = document.getElementById('uncompletedTasks');


let todos = JSON.parse(localStorage.getItem('todos')) || [];
let filter = 'all';

//СОХРАНЕНИЕ
function save() {
    localStorage.setItem('todos', JSON.stringify(todos));
    show();
}


function updateStats() {
    totalSpan.textContent = todos.length;
    doneSpan.textContent = todos.filter(t => t.done).length;
    leftSpan.textContent = todos.filter(t => !t.done).length;
}

//ПОКАЗАТЬ ЗАДАЧИ
function show() {
    //фильтровка задач
    let filtered = todos;
    if (filter === 'uncompleted') filtered = todos.filter(t => !t.done);
    if (filter === 'completed') filtered = todos.filter(t => t.done);
    
    //пустой список
    if (filtered.length === 0) {
        empty.style.display = 'block';
        list.innerHTML = '';
        updateStats();
        return;
    }
    
    empty.style.display = 'none';
    
    //
    let html = '';
    for (let i = 0; i < filtered.length; i++) {
        const t = filtered[i];
        const cat = t.cat || 'other';
        let catText = '📌';
        if (cat === 'work') catText = '💼';
        if (cat === 'personal') catText = '🏠';
        if (cat === 'shopping') catText = '🛒';
        
        html += `
            <li class="todo-item ${t.done ? 'completed' : ''}">
                <input type="checkbox" class="todo-checkbox" data-id="${t.id}" ${t.done ? 'checked' : ''}>
                <span class="todo-text">${t.text}</span>
                <span class="category-tag">${catText}</span>
                <button class="edit-btn" data-id="${t.id}">✏️</button>
                <button class="delete-btn" data-id="${t.id}">🗑️</button>
            </li>
        `;
    }
    list.innerHTML = html;
    updateStats();
}

//ДОБАВЛЕНИЕ ЗАДАЧИ
function add() {
    const text = input.value.trim();
    if (text === '') {
        alert('Напиши задачу!');
        return;
    }
    
    todos.push({
        id: Date.now(),
        text: text,
        cat: category.value,
        done: false
    });
    
    input.value = '';
    save();
}

//УДАЛЕНИЕ
function del(id) {
    if (!confirm('Удалить задачу?')) return;
    
    const newTodos = [];
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id !== id) {
            newTodos.push(todos[i]);
        }
    }
    todos = newTodos;
    save();
}

//ПОМЕНЯТЬ СТАТУС
function toggle(id) {
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
            todos[i].done = !todos[i].done;
            break;
        }
    }
    save();
}

//РЕДАКТИРОВАТЬ
function edit(id) {
    const newText = prompt('Новый текст:');
    if (newText === null || newText.trim() === '') return;
    
    for (let i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
            todos[i].text = newText.trim();
            break;
        }
    }
    save();
}

//УДАЛЕНИЕ СДЕЛАННЫХ
function clearDone() {
    const newTodos = [];
    for (let i = 0; i < todos.length; i++) {
        if (!todos[i].done) {
            newTodos.push(todos[i]);
        }
    }
    todos = newTodos;
    save();
}

//ФИЛЬТР
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        filter = this.dataset.filter;
        show();
    });
});

//НАЖАТИЯ НА СПИСОК
list.addEventListener('click', function(e) {
    const target = e.target;
    
    //Чекбокс
    if (target.classList.contains('todo-checkbox')) {
        toggle(Number(target.dataset.id));
        return;
    }
    
    //Кнопка редактировать
    if (target.classList.contains('edit-btn')) {
        edit(Number(target.dataset.id));
        return;
    }
    
    //Кнопка удалить
    if (target.classList.contains('delete-btn')) {
        del(Number(target.dataset.id));
        return;
    }
});

//КНОПКИ
addBtn.addEventListener('click', add);
input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') add();
});
document.getElementById('clearAll').addEventListener('click', clearDone);


show();