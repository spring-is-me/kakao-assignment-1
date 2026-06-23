import { NextRequest, NextResponse } from "next/server";
import {
  deleteTodoInBackend,
  fetchTodoByIdFromBackend,
  updateTodoInBackend,
} from "@/lib/backend-todos";

type TodoDetailRouteProps = {
  params: Promise<{
    todoId: string;
  }>;
};

function parseTodoId(todoId: string): number | null {
  const parsedTodoId = Number(todoId);
  return Number.isInteger(parsedTodoId) ? parsedTodoId : null;
}

export async function GET(
  _request: NextRequest,
  { params }: TodoDetailRouteProps,
) {
  const { todoId } = await params;
  const parsedTodoId = parseTodoId(todoId);

  if (parsedTodoId === null) {
    return NextResponse.json({ message: "Invalid todo id." }, { status: 400 });
  }

  try {
    const todo = await fetchTodoByIdFromBackend(parsedTodoId);
    if (!todo) {
      return NextResponse.json({ message: "Todo not found." }, { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Failed to load todo from FastAPI.", error);
    return NextResponse.json(
      { message: "Failed to load todo." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: TodoDetailRouteProps,
) {
  const { todoId } = await params;
  const parsedTodoId = parseTodoId(todoId);

  if (parsedTodoId === null) {
    return NextResponse.json({ message: "Invalid todo id." }, { status: 400 });
  }

  try {
    const payload = await request.json();
    const updatedTodo = await updateTodoInBackend(parsedTodoId, payload);

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error("Failed to update todo in FastAPI.", error);
    return NextResponse.json(
      { message: "Failed to update todo." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: TodoDetailRouteProps,
) {
  const { todoId } = await params;
  const parsedTodoId = parseTodoId(todoId);

  if (parsedTodoId === null) {
    return NextResponse.json({ message: "Invalid todo id." }, { status: 400 });
  }

  try {
    await deleteTodoInBackend(parsedTodoId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete todo in FastAPI.", error);
    return NextResponse.json(
      { message: "Failed to delete todo." },
      { status: 500 },
    );
  }
}
