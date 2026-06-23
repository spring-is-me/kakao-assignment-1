const todoFilterOptions = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'completed', label: '완료' },
]

function TodoFilter({
  currentFilter,
  totalTodoCount,
  activeTodoCount,
  completedTodoCount,
  onChangeFilter,
}) {
  const todoCountByFilter = {
    all: totalTodoCount,
    active: activeTodoCount,
    completed: completedTodoCount,
  }

  return (
    <div className="mt-5 grid grid-cols-3 gap-2 rounded-md bg-slate-100 p-1">
      {todoFilterOptions.map((filterOption) => {
        const isActiveFilter = currentFilter === filterOption.value

        return (
          <button
            key={filterOption.value}
            type="button"
            onClick={() => onChangeFilter(filterOption.value)}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              isActiveFilter
                ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-indigo-100'
                : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'
            }`}
          >
            {/* 필터별 개수는 선택된 날짜 안에서 계산된 값입니다. */}
            {filterOption.label} {todoCountByFilter[filterOption.value]}
          </button>
        )
      })}
    </div>
  )
}

export default TodoFilter
