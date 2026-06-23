export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  date_key: string;
};

export type CreateTodoPayload = {
  title: string;
  date_key: string;
  completed?: boolean;
};

export type UpdateTodoPayload = Partial<{
  title: string;
  date_key: string;
  completed: boolean;
}>;

export type TodoFormState = {
  message: string;
};
