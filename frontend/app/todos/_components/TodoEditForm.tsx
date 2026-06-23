"use client";

import { useActionState } from "react";
// 💡 리팩토링 포인트: 에러의 원인이었던 initialTodoFormState 임포트를 제거했습니다.
import { updateTodoAction } from "../actions";
import { Todo } from "@/lib/todos-api";

type TodoEditFormProps = {
  todo: Todo;
};

// 💡 리팩토링 포인트: "use server" 파일 대신, 클라이언트 컴포넌트 내에서 사용할 초기 상태를 정의합니다.
const initialTodoFormState = {
  message: "",
};

export default function TodoEditForm({ todo }: TodoEditFormProps) {
  // Server Action owns the mutation; the client component only renders the form.
  // 💡 이제 이 useActionState는 안전하게 위에서 선언한 로컬 객체를 바라봅니다.
  const [formState, formAction, isPending] = useActionState(
    updateTodoAction,
    initialTodoFormState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="todo_id" value={todo.id} />

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-zinc-800">Title</span>
        <input
          name="title"
          defaultValue={todo.title}
          className="h-12 rounded-md border border-zinc-200 px-4 text-base outline-none transition focus:border-[#672be0] focus:ring-4 focus:ring-[#672be0]/10"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-zinc-800">Date</span>
        <input
          type="date"
          name="date_key"
          defaultValue={todo.date_key}
          className="h-12 rounded-md border border-zinc-200 px-4 text-base outline-none transition focus:border-[#672be0] focus:ring-4 focus:ring-[#672be0]/10"
        />
      </label>

      <label className="flex items-center gap-3 rounded-md border border-zinc-200 p-4">
        <input
          type="checkbox"
          name="completed"
          defaultChecked={todo.completed}
          className="h-5 w-5 accent-[#672be0]"
        />
        <span className="text-sm font-medium text-zinc-800">
          Mark this todo as completed
        </span>
      </label>

      {formState?.message ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formState.message}
        </p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-md bg-[#672be0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5624bd]"
        >
          Save Changes
        </button>
        <span className="self-center text-sm text-zinc-500">
          {isPending ? "Updating the todo..." : "Changes are written back to FastAPI."}
        </span>
      </div>
    </form>
  );
}