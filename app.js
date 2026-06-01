// DOM 요소 선택
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');

// Todo 데이터를 관리할 배열 (각 요소는 { id, text, completed } 구조)
let todos = [];

/**
 * 새로운 Todo 항목을 생성하는 함수
 */
function createTodo() {
    const todoText = todoInput.value.trim();

    // 입력값이 비어있는지 검증 (공백 제외)
    if (todoText === '') {
        alert('할 일을 입력해주세요!');
        todoInput.focus();
        return;
    }

    // 새 Todo 객체 생성
    const newTodo = {
        id: Date.now(), // 고유 ID로 타임스탬프 사용
        text: todoText,
        completed: false
    };

    // 배열에 추가 후 화면 갱신
    todos.push(newTodo);
    renderTodos();

    // 입력창 초기화 및 포커스
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
        // 1. 수정 모드로 전환
        todoItemElement.classList.add('editing');
        const currentText = todoTextElement.textContent;
        
        // 텍스트를 입력창(input)으로 교체
        todoTextElement.innerHTML = `<input type="text" class="edit-input" value="${currentText}">`;
        editButton.textContent = '저장';
        
        // 수정 입력창에 포커스 넣기
        const editInput = todoTextElement.querySelector('.edit-input');
        editInput.focus();
    } else {
        // 2. 수정 사항 저장
        const editInput = todoTextElement.querySelector('.edit-input');
        const updatedText = editInput.value.trim();

        if (updatedText === '') {
            alert('내용을 입력해주세요!');
            editInput.focus();
            return;
        }

        // 데이터 배열 업데이트
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, text: updatedText };
            }
            return todo;
        });

        // 화면 갱신하여 수정 모드 해제 및 반영
        renderTodos();
    }
}

/**
 * todos 배열을 기반으로 화면에 목록을 그리 시각화(Render) 함수
 */
function renderTodos() {
    // 기존 목록을 비우기
    todoList.innerHTML = '';

    // 배열을 순회하며 DOM 요소 생성
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        // 할 일 텍스트 영역
        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;

        // 버튼들을 담을 그룹
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        // 완료 버튼
        const completeBtn = document.createElement('button');
        completeBtn.className = 'action-btn complete-btn';
        completeBtn.textContent = todo.completed ? '해제' : '완료';
        completeBtn.addEventListener('click', () => toggleComplete(todo.id));

        // 수정 버튼
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.textContent = '수정';
        editBtn.addEventListener('click', () => handleEdit(todo.id, li));

        // 삭제 버튼
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        // 완료된 상태일 때는 수정 버튼 비활성화 처리 (선택 사항)
        if (todo.completed) {
            editBtn.style.display = 'none';
        }

        // 트리 구조 조립
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

// 입력창에서 Enter 키를 눌렀을 때도 Todo 추가 가능하도록 설정
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        createTodo();
    }
});