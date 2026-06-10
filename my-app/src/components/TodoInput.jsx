import { useState } from 'react'

function TodoInput({ onAddTodo }) {
  const [todoText, setTodoText] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    // App에서 생성 성공 여부를 받아 입력창 초기화 시점을 결정합니다.
    const isTodoAdded = onAddTodo(todoText)

    if (isTodoAdded) {
      setTodoText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="todo-input" className="sr-only">
        새 할 일
      </label>
      <input
        id="todo-input"
        type="text"
        value={todoText}
        onChange={(event) => setTodoText(event.target.value)}
        placeholder="새로운 할 일을 입력하세요"
        className="min-h-12 flex-1 rounded-md border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      />
      <button
        type="submit"
        className="min-h-12 rounded-md bg-indigo-600 px-5 text-base font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
      >
        추가
      </button>
    </form>
  )
}

export default TodoInput
