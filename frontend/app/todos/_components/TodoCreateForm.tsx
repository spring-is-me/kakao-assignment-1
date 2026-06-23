"use client";

import { useActionState } from "react";
// 💡 리팩토링 포인트: 에러의 원인이었던 initialTodoFormState 임포트를 제거했습니다.
import { createTodoAction } from "../actions";

type TodoCreateFormProps = {
  initialDateKey: string;
};

// 💡 리팩토링 포인트: "use server" 파일에서 가져오는 대신, 클라이언트 컴포넌트 내부에서 사용할 초기 상태 객체를 직접 정의합니다.
const initialTodoFormState = {
  message: "",
};

function CreateTodoSubmitButton() {
  return (
    <button
      type="submit"
      className="rounded-md bg-[#672be0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5624bd]"
    >
      Create Todo
    </button>
  );
}

export default function TodoCreateForm({ initialDateKey }: TodoCreateFormProps) {
  // Server Action owns the mutation; the client component only renders the form.
  // 💡 이제 이 useActionState는 안전하게 위에서 선언한 로컬 객체를 바라봅니다.
  const [formState, formAction, isPending] = useActionState(
    createTodoAction,
    initialTodoFormState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-zinc-800">Title</span>
        <input
          name="title"
          placeholder="할 일을 입력하세요"
          className="h-12 rounded-md border border-zinc-200 px-4 text-base outline-none transition placeholder:text-zinc-400 focus:border-[#672be0] focus:ring-4 focus:ring-[#672be0]/10"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-zinc-800">Date</span>
        <input
          type="date"
          name="date_key"
          defaultValue={initialDateKey}
          className="h-12 rounded-md border border-zinc-200 px-4 text-base outline-none transition focus:border-[#672be0] focus:ring-4 focus:ring-[#672be0]/10"
        />
      </label>

      {formState?.message ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formState.message}
        </p>
      ) : null}

      <div className="flex gap-3">
        <CreateTodoSubmitButton />
        <span className="self-center text-sm text-zinc-500">
          {isPending ? "Saving your todo..." : "작성한 할 일은 데이터베이스에 보관됩니다."}
        </span>
      </div>
    </form>
  );
}