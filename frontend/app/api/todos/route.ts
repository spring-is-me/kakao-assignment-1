import { NextRequest, NextResponse } from "next/server";
import {
  createTodoInBackend,
  fetchTodosFromBackend,
} from "@/lib/backend-todos";

export async function GET(request: NextRequest) {
  try {
    // Route Handler proxies list requests to FastAPI and preserves date filtering.
    const dateKey = request.nextUrl.searchParams.get("date_key") ?? undefined;
    const todos = await fetchTodosFromBackend(dateKey);

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Failed to load todos from FastAPI.", error);
    return NextResponse.json(
      { message: "Failed to load todos." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const createdTodo = await createTodoInBackend(payload);

    return NextResponse.json(createdTodo, { status: 201 });
  } catch (error) {
    console.error("Failed to create todo in FastAPI.", error);
    return NextResponse.json(
      { message: "Failed to create todo." },
      { status: 500 },
    );
  }
}
