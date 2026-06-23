"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { deleteTodoAction, toggleTodoAction } from "../actions";
import { Todo } from "@/lib/todos-api";
import {
  addDaysToDateKey,
  formatDateKey,
  formatReadableDate,
} from "./date-utils";

type TodoFilter = "all" | "active" | "completed";

type TodoBoardProps = {
  initialTodos: Todo[];
  initialDateKey: string;
};

const filterLabels: Record<TodoFilter, string> = {
  all: "All",
  active: "Active",
  completed: "Done",
};

export default function TodoBoard({
  initialTodos,
  initialDateKey,
}: TodoBoardProps) {
  // The list stays interactive on the client while the initial payload is server-rendered.
  const [todos, setTodos] = useState(initialTodos);
  const [selectedDateKey, setSelectedDateKey] = useState(initialDateKey);
  const [currentFilter, setCurrentFilter] = useState<TodoFilter>("all");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let ignoreResult = false;

    async function loadTodosForDate() {
      setErrorMessage("");

      try {
        const response = await fetch(
          `/api/todos?date_key=${encodeURIComponent(selectedDateKey)}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch todos.");
        }

        const nextTodos = (await response.json()) as Todo[];
        if (!ignoreResult) {
          setTodos(nextTodos);
        }
      } catch {
        if (!ignoreResult) {
          setErrorMessage("Could not load todos for this date.");
        }
      }
    }

    loadTodosForDate();

    return () => {
      ignoreResult = true;
    };
  }, [selectedDateKey]);

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  const filterCounts = {
    all: todos.length,
    active: activeTodos.length,
    completed: completedTodos.length,
  };

  const visibleTodos =
    currentFilter === "active"
      ? activeTodos
      : currentFilter === "completed"
        ? completedTodos
        : todos;

  function moveSelectedDate(dayAmount: number) {
    setSelectedDateKey((currentDateKey) =>
      addDaysToDateKey(currentDateKey, dayAmount),
    );
  }

  function handleToggleTodo(todo: Todo) {
    setErrorMessage("");

    startTransition(async () => {
      try {
        const updatedTodo = await toggleTodoAction(todo.id, !todo.completed);
        setTodos((currentTodos) =>
          currentTodos.map((currentTodo) =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      } catch {
        setErrorMessage("Could not update the todo status.");
      }
    });
  }

  function handleDeleteTodo(todoId: number) {
    setErrorMessage("");

    startTransition(async () => {
      try {
        await deleteTodoAction(todoId);
        setTodos((currentTodos) =>
          currentTodos.filter((todo) => todo.id !== todoId),
        );
      } catch {
        setErrorMessage("Could not delete the todo.");
      }
    });
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 py-8 sm:py-12">
      <header className="flex flex-col gap-5 border-b border-zinc-200 pb-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#672be0]">Todo</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">
              {formatReadableDate(selectedDateKey)}
            </h1>
          </div>
          <Link
            href={`/todos/new?date_key=${selectedDateKey}`}
            className="rounded-md bg-[#672be0] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5624bd]"
          >
            New Todo
          </Link>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => moveSelectedDate(-1)}
              className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-[#672be0] hover:text-[#672be0]"
            >
              이전
            </button>
            <button
              type="button"
              onClick={() => setSelectedDateKey(formatDateKey(new Date()))}
              className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-[#672be0] hover:text-[#672be0]"
            >
              오늘
            </button>
            <button
              type="button"
              onClick={() => moveSelectedDate(1)}
              className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-[#672be0] hover:text-[#672be0]"
            >
              내일
            </button>
          </div>
          <span className="text-sm text-zinc-500">{selectedDateKey}</span>
        </div>

        <nav className="grid grid-cols-3 gap-2 rounded-lg bg-zinc-100 p-1">
          {(Object.keys(filterLabels) as TodoFilter[]).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setCurrentFilter(filter)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                currentFilter === filter
                  ? "bg-white text-[#672be0] shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {filterLabels[filter]} {filterCounts[filter]}
            </button>
          ))}
        </nav>
      </header>

      {errorMessage ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        {visibleTodos.length > 0 ? (
          visibleTodos.map((todo) => (
            <article
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <button
                type="button"
                onClick={() => handleToggleTodo(todo)}
                disabled={isPending}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition ${
                  todo.completed
                    ? "border-[#672be0] bg-[#672be0] text-white"
                    : "border-zinc-300 text-transparent hover:border-[#672be0]"
                }`}
                aria-label={todo.completed ? "Mark as active" : "Mark as complete"}
              >
                OK
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-base font-medium ${
                    todo.completed
                      ? "text-zinc-400 line-through"
                      : "text-zinc-950"
                  }`}
                >
                  {todo.title}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{todo.date_key}</p>
              </div>

              <Link
                href={`/todos/${todo.id}`}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDeleteTodo(todo.id)}
                disabled={isPending}
                className="rounded-md px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
              >
                Delete
              </button>
            </article>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
            <p className="text-base font-medium text-zinc-900">
              계획된 일이 없습니다!
              일정을 계획하세요
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              꿈은 이룰 수 있으니까 꾸는 거래요~☆
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
