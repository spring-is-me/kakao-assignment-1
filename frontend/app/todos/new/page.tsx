import Link from "next/link";
import TodoCreateForm from "../_components/TodoCreateForm";
import { formatDateKey } from "../_components/date-utils";

type NewTodoPageProps = {
  searchParams: Promise<{
    date_key?: string;
  }>;
};

export default async function NewTodoPage({ searchParams }: NewTodoPageProps) {
  const { date_key } = await searchParams;
  const initialDateKey = date_key ?? formatDateKey(new Date());

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 py-10">
      <div className="border-b border-zinc-200 pb-6">
        <Link href="/todos" className="text-sm font-medium text-[#672be0]">
          돌아가기
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
          새 Ｔｏｄｏ를 만들어봐!
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          너무 많은 목표는 노노~~
        </p>
      </div>

      <TodoCreateForm initialDateKey={initialDateKey} />
    </main>
  );
}
