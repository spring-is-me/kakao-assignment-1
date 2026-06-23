export default function TodosLoading() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 py-8 sm:py-12">
      <div className="border-b border-zinc-200 pb-6">
        <div className="h-4 w-16 animate-pulse rounded bg-[#672be0]/20" />
        <div className="mt-4 h-9 w-72 animate-pulse rounded bg-zinc-200" />
        <div className="mt-5 flex gap-2">
          <div className="h-10 w-16 animate-pulse rounded-md bg-zinc-200" />
          <div className="h-10 w-16 animate-pulse rounded-md bg-zinc-200" />
          <div className="h-10 w-16 animate-pulse rounded-md bg-zinc-200" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-lg bg-zinc-100 p-1">
        <div className="h-10 animate-pulse rounded-md bg-white" />
        <div className="h-10 animate-pulse rounded-md bg-white" />
        <div className="h-10 animate-pulse rounded-md bg-white" />
      </div>

      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4"
          >
            <div className="h-6 w-6 animate-pulse rounded-full bg-zinc-200" />
            <div className="flex-1">
              <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-200" />
              <div className="mt-2 h-3 w-24 animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
