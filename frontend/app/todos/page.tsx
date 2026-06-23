import TodoBoard from "./_components/TodoBoard";
import { formatDateKey } from "./_components/date-utils";
import { fetchTodosFromBackend } from "@/lib/backend-todos";
import { Todo } from "@/lib/todos-api";

export const dynamic = "force-dynamic";

type TodosPageProps = {
  searchParams: Promise<{
    date_key?: string;
  }>;
};

async function fetchTodosForPage(dateKey: string): Promise<Todo[]> {
  return fetchTodosFromBackend(dateKey);
}

export default async function TodosPage({ searchParams }: TodosPageProps) {
  // The page stays server-rendered and loads the first date-specific dataset.
  const { date_key } = await searchParams;
  const initialDateKey = date_key ?? formatDateKey(new Date());
  const initialTodos = await fetchTodosForPage(initialDateKey);

  return <TodoBoard initialTodos={initialTodos} initialDateKey={initialDateKey} />;
}
