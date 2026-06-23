import Link from "next/link";
import { notFound } from "next/navigation";
import TodoEditForm from "../_components/TodoEditForm";
import { fetchTodoByIdFromBackend } from "@/lib/backend-todos";
import { Todo } from "@/lib/todos-api";

export const dynamic = "force-dynamic";

type TodoEditPageProps = {
  params: Promise<{
    todoId: string;
  }>;
};

async function fetchTodoForPage(todoId: number): Promise<Todo | null> {
  return fetchTodoByIdFromBackend(todoId);
}

export default async function TodoEditPage({ params }: TodoEditPageProps) {
  // The server resolves the existing todo before rendering the edit form.
  const { todoId } = await params;
  const parsedTodoId = Number(todoId);

  if (!Number.isInteger(parsedTodoId)) {
    notFound();
  }

  const todo = await fetchTodoForPage(parsedTodoId);
  if (!todo) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 py-10">
      <div className="border-b border-zinc-200 pb-6">
        <Link
          href={`/todos?date_key=${todo.date_key}`}
          className="text-sm font-medium text-[#672be0]"
        >
          돌아가기
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
          Edit Todo
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Update the title, date, and completion state for this task.
        </p>
      </div>

      <TodoEditForm todo={todo} />
    </main>
  );
}
