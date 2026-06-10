import { useEffect, useState } from 'react'
import TodoDateHeader from './components/TodoDateHeader'
import TodoFilter from './components/TodoFilter'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'

const TODO_STORAGE_KEY = 'kakaotech-todos'

const formatDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const moveDateByDays = (dateKey, dayAmount) => {
  const nextDate = new Date(`${dateKey}T00:00:00`)
  nextDate.setDate(nextDate.getDate() + dayAmount)

  return formatDateKey(nextDate)
}

const createDefaultDateKey = () => formatDateKey(new Date())

const loadStoredTodos = () => {
  const defaultDateKey = createDefaultDateKey()

  try {
    const storedTodos = localStorage.getItem(TODO_STORAGE_KEY)

    if (!storedTodos) {
      return []
    }

    const parsedTodos = JSON.parse(storedTodos)

    if (!Array.isArray(parsedTodos)) {
      return []
    }

    // 저장된 데이터에 dateKey가 없다면 오늘 날짜를 넣어 날짜 필터가 깨지지 않게 합니다.
    return parsedTodos
      .filter((todo) => todo && typeof todo.text === 'string')
      .map((todo) => ({
        id: todo.id || crypto.randomUUID(),
        text: todo.text,
        isCompleted: Boolean(todo.isCompleted),
        dateKey: todo.dateKey || defaultDateKey,
      }))
  } catch {
    // JSON 파싱에 실패한 데이터는 앱을 멈추지 않도록 빈 배열로 대체합니다.
    return []
  }
}

function App() {
  const [todos, setTodos] = useState(loadStoredTodos)
  const [currentFilter, setCurrentFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState(createDefaultDateKey)

  useEffect(() => {
    // Todo 배열이 바뀔 때마다 한 곳에서만 localStorage에 JSON 문자열로 저장합니다.
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const selectedDateTodos = todos.filter(
    (todo) => todo.dateKey === selectedDate,
  )
  const totalTodoCount = selectedDateTodos.length
  const completedTodoCount = selectedDateTodos.filter(
    (todo) => todo.isCompleted,
  ).length
  const activeTodoCount = totalTodoCount - completedTodoCount

  const filteredTodos = selectedDateTodos.filter((todo) => {
    // 선택된 날짜의 Todo 안에서 현재 상태 필터에 맞는 항목만 보여줍니다.
    if (currentFilter === 'active') {
      return !todo.isCompleted
    }

    if (currentFilter === 'completed') {
      return todo.isCompleted
    }

    return true
  })

  const handleMovePreviousDate = () => {
    setSelectedDate((previousDate) => moveDateByDays(previousDate, -1))
  }

  const handleMoveNextDate = () => {
    setSelectedDate((previousDate) => moveDateByDays(previousDate, 1))
  }

  const handleAddTodo = (todoText) => {
    const trimmedTodoText = todoText.trim()

    // 비어 있는 입력값은 Todo로 저장하지 않고 사용자에게 안내합니다.
    if (!trimmedTodoText) {
      alert('할 일을 입력해 주세요.')
      return false
    }

    const newTodo = {
      id: crypto.randomUUID(),
      text: trimmedTodoText,
      isCompleted: false,
      dateKey: selectedDate,
    }

    setTodos((previousTodos) => [newTodo, ...previousTodos])
    return true
  }

  const handleUpdateTodo = (todoId, nextTodoText) => {
    const trimmedTodoText = nextTodoText.trim()

    // 수정 시에도 빈 문자열은 저장하지 않아 Todo 내용이 사라지지 않게 합니다.
    if (!trimmedTodoText) {
      alert('수정할 내용을 입력해 주세요.')
      return false
    }

    setTodos((previousTodos) =>
      previousTodos.map((todo) =>
        todo.id === todoId ? { ...todo, text: trimmedTodoText } : todo,
      ),
    )
    return true
  }

  const handleToggleTodo = (todoId) => {
    setTodos((previousTodos) =>
      previousTodos.map((todo) =>
        todo.id === todoId
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo,
      ),
    )
  }

  const handleDeleteTodo = (todoId) => {
    setTodos((previousTodos) =>
      previousTodos.filter((todo) => todo.id !== todoId),
    )
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10 text-slate-900">
      <section className="mx-auto w-full max-w-2xl">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-600">
            React Todo
          </p>
          <h1 className="text-4xl font-bold tracking-normal text-slate-950">
            날짜별 할 일을 정리해요
          </h1>
          <p className="mt-3 text-base text-slate-600">
            선택한 날짜에 Todo를 저장하고, 날짜와 상태 필터를 함께 적용해
            확인할 수 있습니다.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <TodoDateHeader
            selectedDate={selectedDate}
            onMovePreviousDate={handleMovePreviousDate}
            onMoveNextDate={handleMoveNextDate}
          />

          <TodoInput onAddTodo={handleAddTodo} />

          <div className="mt-6 flex items-center justify-between border-y border-slate-100 py-4 text-sm text-slate-600">
            <span>선택 날짜 전체 {totalTodoCount}개</span>
            <span>완료 {completedTodoCount}개</span>
          </div>

          <TodoFilter
            currentFilter={currentFilter}
            totalTodoCount={totalTodoCount}
            activeTodoCount={activeTodoCount}
            completedTodoCount={completedTodoCount}
            onChangeFilter={setCurrentFilter}
          />

          <TodoList
            todos={filteredTodos}
            currentFilter={currentFilter}
            onUpdateTodo={handleUpdateTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        </div>
      </section>
    </main>
  )
}

export default App
