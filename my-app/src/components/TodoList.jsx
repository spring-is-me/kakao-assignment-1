import TodoItem from './TodoItem'

const emptyMessageByFilter = {
  all: '선택한 날짜에 등록된 할 일이 없습니다.',
  active: '선택한 날짜에 진행 중인 할 일이 없습니다.',
  completed: '선택한 날짜에 완료된 할 일이 없습니다.',
}

function TodoList({
  todos,
  currentFilter,
  onUpdateTodo,
  onToggleTodo,
  onDeleteTodo,
}) {
  if (todos.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-base font-medium text-slate-500">
          {emptyMessageByFilter[currentFilter]}
        </p>
      </div>
    )
  }

  return (
    <ul className="mt-5 space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdateTodo={onUpdateTodo}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  )
}

export default TodoList
