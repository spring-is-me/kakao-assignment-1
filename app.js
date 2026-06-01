// DOM 요소 선택
const currentDateDisplay = document.getElementById('current-date-display');
const prevDateButton = document.getElementById('prev-date-btn');
const nextDateButton = document.getElementById('next-date-btn');
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const filterButtons = document.querySelectorAll('.filter-btn');
const todoList = document.getElementById('todo-list');

// Todo 데이터를 관리할 배열 (각 요소는 { id, text, completed, date } 구조)
let todos = [];

// 현재 선택된 필터 상태 ('all', 'active', 'completed')
let currentFilter = 'all';

// 현재 사용자가 보고 있는 날짜 객체 관리 (신규 추가)
let currentDate = new Date();

/**
 * Date 객체를 'YYYY-MM-DD' 형식의 문자열로 변환하는 헬퍼 함수 (신규 추가)
 * @param {Date} dateObj - 변환할 Date 객체
 * @returns {string} 'YYYY-MM-DD' 형식의 문자열
 */
function formatDateString(dateObj) {
    const year = dateObj.getFullYear();
    // 월과 일은 항상 2자리 문자열이 되도록 padding 처리
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const date = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
    }

/**
 * 화면 상단의 날짜 텍스트를 현재 선택된 날짜에 맞게 업데이트하는 함수 (신규 추가)
 */
function updateDateDisplay() {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const date = String(currentDate.getDate()).padStart(2, '0');
    
    // UI에 보여줄 텍스트 형식 설정
    currentDateDisplay.textContent = `${year}년 ${month}월 ${date}일`;
}

/**
 * 날짜를 이전이나 다음으로 이동시키는 함수 (신규 추가)
 * @param {number} offset - 이동할 일수 (-1은 하루 전, 1은 하루 뒤)
 */
function moveDate(offset) {
    currentDate.setDate(currentDate.getDate() + offset);
    updateDateDisplay();
    renderTodos(); // 날짜가 바뀌었으므로 해당 날짜의 목록 재렌더링
}

/**
 * 새로운 Todo 항목을 생성하는 함수 (수정)
 */
function createTodo() {
    const todoText = todoInput.value.trim();

    if (todoText === '') {
        alert('할 일을 입력해주세요!');
        todoInput.focus();
        return;
    }

    // 새 Todo 객체 생성 시 현재 선택된 날짜 문자열('YYYY-MM-DD')을 함께 보관
    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        date: formatDateString(currentDate) // 날짜 데이터 바인딩 (신규 추가)
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
 * 필터링 탭 전환 및 버튼 스타일을 업데이트하는 함수
 * @param {Event} event - 클릭 이벤트 객체
 */
function handleFilter(event) {
    currentFilter = event.target.getAttribute('data-filter');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderTodos();
}

/**
 * 날짜 필터링과 상태 필터링을 둘 다 적용하여 최종 출력할 배열을 반환하는 함수 (수정)
 * @returns {Array} 필터링이 완료된 Todo 배열
 */
function getFilteredTodos() {
    const targetDateString = formatDateString(currentDate);

    // 1차 필터링: 현재 화면에 선택된 날짜와 일치하는 Todo만 선별
    const dateFilteredTodos = todos.filter(todo => todo.date === targetDateString);

    // 2차 필터링: 선택된 진행 상태(전체/진행 중/완료)에 따라 선별
    if (currentFilter === 'active') {
        return dateFilteredTodos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        return dateFilteredTodos.filter(todo => todo.completed);
    }
    return dateFilteredTodos;
}

/**
 * todos 배열을 기반으로 화면에 목록을 그리는 시각화(Render) 함수
 */
function renderTodos() {
    todoList.innerHTML = '';

    // 날짜 및 상태 조건이 모두 반영된 배열 가져오기
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

filterButtons.forEach(button => {
    button.addEventListener('click', handleFilter);
});

// 날짜 이동 버튼 이벤트 리스너 등록 (신규 추가)
prevDateButton.addEventListener('click', () => moveDate(-1)); // 하루 전으로
nextDateButton.addEventListener('click', () => moveDate(1));  // 하루 뒤로

// 초기 앱 실행 시 기본 세팅 및 화면 그리기 (신규 추가)
updateDateDisplay();
renderTodos();