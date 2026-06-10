const formatDisplayDate = (dateKey) => {
  const date = new Date(`${dateKey}T00:00:00`)

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date)
}

function TodoDateHeader({
  selectedDate,
  onMovePreviousDate,
  onMoveNextDate,
}) {
  return (
    <div className="mb-5 rounded-md border border-indigo-100 bg-indigo-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onMovePreviousDate}
          className="rounded-md border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
        >
          이전 날짜
        </button>

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
            선택된 날짜
          </p>
          <time
            dateTime={selectedDate}
            className="mt-1 block text-xl font-bold text-slate-950"
          >
            {formatDisplayDate(selectedDate)}
          </time>
          <p className="mt-1 text-sm text-slate-500">{selectedDate}</p>
        </div>

        <button
          type="button"
          onClick={onMoveNextDate}
          className="rounded-md border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
        >
          다음 날짜
        </button>
      </div>
    </div>
  )
}

export default TodoDateHeader
