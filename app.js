// DOM 요소 선택
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const errorMessage = document.getElementById('error-message');
const filterButtons = document.querySelectorAll('.filter-btn');

// 날짜 네비게이션 요소 선택
const currentDateDisplay = document.getElementById('current-date-display');
const prevDateBtn = document.getElementById('prev-date-btn');
const nextDateBtn = document.getElementById('next-date-btn');

// 로컬 스토리지에 사용할 키 명칭 정의
const STORAGE_KEY = 'taskflow_todos';

// Todo 데이터를 관리할 배열
let todos = [];

// 상태 관리 변수 (필터 및 선택된 현재 날짜)
let currentFilter = 'all';
let currentDate = new Date(); // 기본값: 오늘 날짜

/**
 * Todo 앱 초기화 함수
 */
function init() {
    todoForm.addEventListener('submit', handleTodoSubmit);
    initFilterEvents();
    initDateEvents();
    
    // 1. 화면에 날짜 포맷팅 반영
    updateDateDisplay();
    
    // 2. 로컬 스토리지에서 기존 보관된 데이터를 순차적으로 로드
    loadFromLocalStorage();
    
    // 3. 로드된 데이터 세션을 바탕으로 최초 렌더링 즉시 실행
    renderTodos();
}

/**
 * 로컬 스토리지에 현재 todos 배열 상태를 JSON 문자열로 저장하는 함수
 */
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

/**
 * 로컬 스토리지에서 JSON 데이터를 파싱하여 불러오는 함수
 */
function loadFromLocalStorage() {
    const storageData = localStorage.getItem(STORAGE_KEY);
    // 안전한 파싱을 위해 삼항 연산자 처리 및 예외 처리 구문 배치
    try {
        todos = storageData ? JSON.parse(storageData) : [];
    } catch (e) {
        console.error("로컬 스토리지 데이터를 읽어오는 중 에러가 발생했습니다.", e);
        todos = [];
    }
}

/**
 * 필터 버튼 이벤트 바인딩
 */
function initFilterEvents() {
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            currentFilter = e.target.dataset.filter;
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            renderTodos();
        });
    });
}

/**
 * 날짜 이동 버튼 이벤트 바인딩
 */
function initDateEvents() {
    prevDateBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDateDisplay();
        renderTodos();
    });

    nextDateBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDateDisplay();
        renderTodos();
    });
}

/**
 * Date 객체를 'YYYY-MM-DD' 스트링 포맷으로 변환하는 헬퍼 함수
 */
function formatDateString(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const date = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
}

/**
 * 상단 화면에 날짜를 포맷팅하여 표시하는 함수
 */
function updateDateDisplay() {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const date = String(currentDate.getDate()).padStart(2, '0');
    currentDateDisplay.textContent = `${year}년 ${month}월 ${date}일`;
}

/**
 * 새로운 Todo 등록 이벤트 핸들러
 */
function handleTodoSubmit(event) {
    event.preventDefault();
    
    const todoText = todoInput.value.trim();

    if (todoText === '') {
        errorMessage.textContent = '할 일을 입력해주세요!';
        todoInput.focus();
        return;
    }

    errorMessage.textContent = '';

    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        date: formatDateString(currentDate) 
    };

    todos.push(newTodo);
    
    // 변경 사항 저장 및 화면 갱신
    saveToLocalStorage();
    renderTodos();

    todoInput.value = '';
}

/**
 * 현재 선택된 날짜 및 필터 상태에 맞춰 Todo 배열을 필터링하는 함수
 */
function getFilteredTodos() {
    const targetDateStr = formatDateString(currentDate);
    let dateFilteredTodos = todos.filter(todo => todo.date === targetDateStr);

    switch (currentFilter) {
        case 'active':
            return dateFilteredTodos.filter(todo => !todo.completed);
        case 'completed':
            return dateFilteredTodos.filter(todo => todo.completed);
        case 'all':
        default:
            return dateFilteredTodos;
    }
}

/**
 * 상태 데이터를 기반으로 화면에 Todo 리스트를 다시 그리는 함수
 */
function renderTodos() {
    todoList.innerHTML = '';

    const filteredTodos = getFilteredTodos();

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;
        li.appendChild(textSpan);

        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.textContent = todo.completed ? '취소' : '완료';
        completeBtn.addEventListener('click', () => toggleComplete(todo.id));
        btnGroup.appendChild(completeBtn);

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = '수정';
        editBtn.addEventListener('click', () => enableEditMode(li, todo, textSpan, btnGroup));
        btnGroup.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        btnGroup.appendChild(deleteBtn);

        li.appendChild(btnGroup);
        todoList.appendChild(li);
    });
}

/**
 * Todo 완료 여부 토글 함수
 */
function toggleComplete(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveToLocalStorage();
    renderTodos();
}

/**
 * Todo 아이템을 수정 모드로 전환하는 함수
 */
function enableEditMode(li, todo, textSpan, btnGroup) {
    if (todo.completed) {
        errorMessage.textContent = '완료된 할 일은 수정할 수 없습니다.';
        return;
    }
    errorMessage.textContent = '';

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = todo.text;

    li.replaceChild(editInput, textSpan);
    editInput.focus();

    btnGroup.innerHTML = '';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = '저장';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-btn';
    cancelBtn.textContent = '취소';

    const saveChanges = () => {
        const updatedText = editInput.value.trim();
        if (updatedText === '') {
            errorMessage.textContent = '수정할 내용을 입력해주세요.';
            editInput.focus();
            return;
        }
        updateTodoText(todo.id, updatedText);
    };

    saveBtn.addEventListener('click', saveChanges);
    cancelBtn.addEventListener('click', renderTodos);
    editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveChanges();
        if (e.key === 'Escape') renderTodos();
    });

    btnGroup.appendChild(saveBtn);
    btnGroup.appendChild(cancelBtn);
}

/**
 * Todo 텍스트 내용 수정 함수
 */
function updateTodoText(id, newText) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, text: newText } : todo
    );
    saveToLocalStorage();
    renderTodos();
}

/**
 * Todo 삭제 함수
 */
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveToLocalStorage();
    renderTodos();
}

// 애플리케이션 시작
init();