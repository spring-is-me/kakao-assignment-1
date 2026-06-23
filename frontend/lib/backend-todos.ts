import axios from "axios";
import { CreateTodoPayload, Todo, UpdateTodoPayload } from "./todos-api";

// 💡 리팩토링 포인트: Server Action(서버 사이드)에서만 호출되므로 
// 브라우저에 노출되지 않는 process.env.BACKEND_URL을 우선적으로 사용하도록 수정합니다.
const TODO_API_BASE_URL =
  process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

// This client talks directly to the FastAPI service from server-only code.
const backendTodoApiClient = axios.create({
  baseURL: TODO_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchTodosFromBackend(dateKey?: string): Promise<Todo[]> {
  const response = await backendTodoApiClient.get<Todo[]>("/todos", {
    params: dateKey ? { date_key: dateKey } : undefined,
  });

  return response.data;
}

export async function fetchTodoByIdFromBackend(
  todoId: number,
): Promise<Todo | null> {
  const todos = await fetchTodosFromBackend();
  return todos.find((todo) => todo.id === todoId) ?? null;
}

export async function createTodoInBackend(
  payload: CreateTodoPayload,
): Promise<Todo> {
  const response = await backendTodoApiClient.post<Todo>("/todos", payload);
  return response.data;
}

export async function updateTodoInBackend(
  todoId: number,
  payload: UpdateTodoPayload,
): Promise<Todo> {
  const response = await backendTodoApiClient.put<Todo>(
    `/todos/${todoId}`,
    payload,
  );
  return response.data;
}

export async function deleteTodoInBackend(todoId: number): Promise<void> {
  await backendTodoApiClient.delete(`/todos/${todoId}`);
}