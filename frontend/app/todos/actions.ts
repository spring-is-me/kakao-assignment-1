"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createTodoInBackend,
  deleteTodoInBackend,
  updateTodoInBackend,
} from "@/lib/backend-todos";
import { Todo, TodoFormState } from "@/lib/todos-api";

// export 키워드를 빼고 파일 내부에서만 쓰거나, 
// 필요한 컴포넌트(NewTodoPage 등) 파일 내부에서 직접 선언해서 사용하면 됩니다.
const initialTodoFormState: TodoFormState = {
  message: "",
};

export async function createTodoAction(
  _previousState: TodoFormState,
  formData: FormData,
): Promise<TodoFormState> {
  const title = String(formData.get("title") ?? "").trim();
  const dateKey = String(formData.get("date_key") ?? "").trim();

  if (!title) {
    return { message: "글을 입력하세요" };
  }

  if (!dateKey) {
    return { message: "날짜를 선택하세요" };
  }

  try {
    await createTodoInBackend({
      title,
      date_key: dateKey,
    });
  } catch {
    return { message: "Could not create the todo. Please try again." };
  }

  revalidatePath("/todos");
  revalidatePath("/todos/new");
  redirect(`/todos?date_key=${dateKey}`);
}

export async function updateTodoAction(
  _previousState: TodoFormState,
  formData: FormData,
): Promise<TodoFormState> {
  const todoId = Number(formData.get("todo_id"));
  const title = String(formData.get("title") ?? "").trim();
  const dateKey = String(formData.get("date_key") ?? "").trim();
  const completed = formData.get("completed") === "on";

  if (!Number.isInteger(todoId)) {
    return { message: "Invalid todo id." };
  }

  if (!title) {
    return { message: "Please enter a todo title." };
  }

  if (!dateKey) {
    return { message: "Please choose a date." };
  }

  try {
    await updateTodoInBackend(todoId, {
      title,
      date_key: dateKey,
      completed,
    });
  } catch {
    return { message: "Could not update the todo. Please try again." };
  }

  revalidatePath("/todos");
  revalidatePath(`/todos/${todoId}`);
  redirect(`/todos?date_key=${dateKey}`);
}

export async function toggleTodoAction(
  todoId: number,
  completed: boolean,
): Promise<Todo> {
  const updatedTodo = await updateTodoInBackend(todoId, {
    completed,
  });

  revalidatePath("/todos");
  revalidatePath(`/todos/${todoId}`);
  return updatedTodo;
}

export async function deleteTodoAction(todoId: number): Promise<void> {
  await deleteTodoInBackend(todoId);

  revalidatePath("/todos");
  revalidatePath(`/todos/${todoId}`);
}
