// DOM 요소 선택
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn'); // 필터 버튼들 선택 (신규 추가)

// Todo 데이터를 관리할 배열
let todos = [];

// 현재 선택된 필터 상태를 저장하는 변수 ('all', 'active', 'completed') (신규 추가)
let currentFilter = 'all';

/**
 * 새로운 Todo 항목을 생성하는 함수
 */
function createTodo() {
    const todoText = todoInput.value.trim();

    if (todoText === '') {
        alert('할 일을 입력해주세요!');
        todoInput.focus();
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false
    };

    todos.push(newTodo);
    renderTodos();

    todoInput.value = '';
    todoInput.focus();
}

/**
 * Todo 항목을 삭제하는 함수
 * @param {number} id - 삭제할 Todo의 고유 ID
 */
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

/**
 * Todo 항목의 완료 상태를 토글하는 함수
 * @param {number} id - 토글할 Todo의 고유 ID
 */
function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    renderTodos();
}

/**
 * Todo 항목을 수정 모드로 전환하거나 수정을 확정하는 함수
 * @param {number} id - 수정할 Todo의 고유 ID
 * @param {HTMLElement} todoItemElement - 해당 Todo의 DOM 요소
 */
function handleEdit(id, todoItemElement) {
    const todoTextElement = todoItemElement.querySelector('.todo-text');
    const editButton = todoItemElement.querySelector('.edit-btn');
    const isEditing = todoItemElement.classList.contains('editing');

    if (!isEditing) {
        todoItemElement.classList.add('editing');
        const currentText = todoTextElement.textContent;
        
        todoTextElement.innerHTML = `<input type="text" class="edit-input" value="${currentText}">`;
        editButton.textContent = '저장';
        
        const editInput = todoTextElement.querySelector('.edit-input');
        editInput.focus();
    } else {
        const editInput = todoTextElement.querySelector('.edit-input');
        const updatedText = editInput.value.trim();

        if (updatedText === '') {
            alert('내용을 입력해주세요!');
            editInput.focus();
            return;
        }

        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, text: updatedText };
            }
            return todo;
        });

        renderTodos();
    }
}

/**
 * 필터링 탭 전환 및 버튼 스타일을 업데이트하는 함수 (신규 추가)
 * @param {Event} event - 클릭 이벤트 객체
 */
function handleFilter(event) {
    // 클릭된 버튼의 data-filter 속성 값 가져오기 ('all', 'active', 'completed')
    currentFilter = event.target.getAttribute('data-filter');

    // 모든 필터 버튼에서 active 클래스 제거
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // 현재 클릭된 버튼에만 active 클래스 추가
    event.target.classList.add('active');

    // 변경된 필터 조건으로 목록 다시 그리기
    renderTodos();
}

/**
 * 현재 필터 상태(currentFilter)에 따라 필터링된 배열을 반환하는 함수 (신규 추가)
 * @returns {Array} 필터링된 Todo 배열
 */
function getFilteredTodos() {
    if (currentFilter === 'active') {
        return todos.filter(todo => !todo.completed); // 완료되지 않은 항목만
    } else if (currentFilter === 'completed') {
        return todos.filter(todo => todo.completed);  // 완료된 항목만
    }
    return todos; // 'all'인 경우 전체 항목 반환
}

/**
 * todos 배열을 기반으로 화면에 목록을 그리는 시각화(Render) 함수
 */
function renderTodos() {
    todoList.innerHTML = '';

    // 현재 필터 조건에 맞는 데이터만 가져와서 순회 (수정)
    const filteredTodos = getFilteredTodos();

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'action-btn complete-btn';
        completeBtn.textContent = todo.completed ? '해제' : '완료';
        completeBtn.addEventListener('click', () => toggleComplete(todo.id));

        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.textContent = '수정';
        editBtn.addEventListener('click', () => handleEdit(todo.id, li));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        if (todo.completed) {
            editBtn.style.display = 'none';
        }

        buttonGroup.appendChild(completeBtn);
        buttonGroup.appendChild(editBtn);
        buttonGroup.appendChild(deleteBtn);

        li.appendChild(textSpan);
        li.appendChild(buttonGroup);

        todoList.appendChild(li);
    });
}

// 이벤트 리스너 등록
addButton.addEventListener('click', createTodo);

todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        createTodo();
    }
});

// 각각의 필터 버튼에 클릭 이벤트 리스너 추가 (신규 추가)
filterButtons.forEach(button => {
    button.addEventListener('click', handleFilter);
});