"use client";

type TodosErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TodosError({ error, reset }: TodosErrorProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-5">
      <section className="w-full rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-[#672be0]">Todo API Error</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
          The todo screen could not load.
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-500">
          Check that the FastAPI server is running, then retry the request.
        </p>
        <p className="mt-2 text-xs text-zinc-400">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-md bg-[#672be0] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5624bd]"
        >
          Retry
        </button>
      </section>
    </main>
  );
}
