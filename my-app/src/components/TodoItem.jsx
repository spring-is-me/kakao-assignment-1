import { useState } from 'react'

function TodoItem({ todo, onUpdateTodo, onToggleTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingTodoText, setEditingTodoText] = useState(todo.text)

  const handleStartEdit = () => {
    setEditingTodoText(todo.text)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditingTodoText(todo.text)
    setIsEditing(false)
  }

  const handleSubmitEdit = (event) => {
    event.preventDefault()

    // 수정 성공 시에만 읽기 모드로 돌아갑니다.
    const isTodoUpdated = onUpdateTodo(todo.id, editingTodoText)

    if (isTodoUpdated) {
      setIsEditing(false)
    }
  }

  return (
    <li className="rounded-md border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-200 hover:bg-white">
      {isEditing ? (
        <form onSubmit={handleSubmitEdit} className="flex flex-col gap-3">
          <label htmlFor={`edit-${todo.id}`} className="sr-only">
            할 일 수정
          </label>
          <input
            id={`edit-${todo.id}`}
            type="text"
            value={editingTodoText}
            onChange={(event) => setEditingTodoText(event.target.value)}
            className="min-h-11 rounded-md border border-slate-300 bg-white px-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              저장
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span
            className={`text-left text-base font-medium ${
              todo.isCompleted
                ? 'text-slate-400 line-through'
                : 'text-slate-900'
            }`}
          >
            {todo.text}
          </span>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onToggleTodo(todo.id)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                todo.isCompleted
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
            >
              {todo.isCompleted ? '진행' : '완료'}
            </button>
            <button
              type="button"
              onClick={handleStartEdit}
              className="rounded-md bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-200"
            >
              수정
            </button>
            <button
              type="button"
              onClick={() => onDeleteTodo(todo.id)}
              className="rounded-md bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

export default TodoItem
