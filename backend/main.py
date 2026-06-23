from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict # 👈 환경변수 관리를 위해 추가
from sqlalchemy import Boolean, Column, Integer, String, create_engine, text
from sqlalchemy.orm import Session, declarative_base, sessionmaker

# ==========================================
# [환경변수 설정 클래스] .env 파일을 자동으로 로드합니다.
# ==========================================
class Settings(BaseSettings):
    database_url: str = "sqlite:///./todos.db"  # 기본값 지정

    # 시스템 환경변수 우선 적용 및 .env 파일 매핑 설정
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()

# 기존 하드코딩 문자열 "sqlite:///./todos.db"을 settings.database_url로 변경!
DATABASE_URL = settings.database_url

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# (이하 Todo 테이블 정의 및 나머지 API 코드는 기존과 완전히 동일합니다...)

# Todo table stores the same core state used by the vanilla/React Todo app.
class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    date_key = Column(String, nullable=False, index=True)


class TodoCreate(BaseModel):
    title: str = Field(..., min_length=1, description="Todo title")
    date_key: str = Field(..., min_length=1, description="Selected date in YYYY-MM-DD format")
    completed: bool = Field(default=False, description="Todo completion state")

    @field_validator("title", "date_key")
    @classmethod
    def validate_not_blank(cls, value: str) -> str:
        stripped_value = value.strip()
        if not stripped_value:
            raise ValueError("Value cannot be blank")
        return stripped_value


class TodoUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, description="Updated Todo title")
    date_key: str | None = Field(default=None, min_length=1, description="Updated date key")
    completed: bool | None = Field(default=None, description="Updated completion state")

    @field_validator("title", "date_key")
    @classmethod
    def validate_not_blank(cls, value: str | None) -> str | None:
        if value is None:
            return value

        stripped_value = value.strip()
        if not stripped_value:
            raise ValueError("Value cannot be blank")
        return stripped_value


class TodoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    completed: bool
    date_key: str


# Create tables automatically so the assignment can run without migrations.
Base.metadata.create_all(bind=engine)


def sync_todo_table_schema():
    """Keep an existing local SQLite file compatible while developing the assignment."""
    with engine.begin() as connection:
        columns = {
            row[1]
            for row in connection.execute(text("PRAGMA table_info(todos)")).fetchall()
        }

        if "title" not in columns:
            connection.execute(text("ALTER TABLE todos ADD COLUMN title VARCHAR NOT NULL DEFAULT ''"))
            columns.add("title")

        if "completed" not in columns:
            connection.execute(text("ALTER TABLE todos ADD COLUMN completed BOOLEAN NOT NULL DEFAULT 0"))
            columns.add("completed")

        # If an earlier local test DB used different names, copy that data forward once.
        if "content" in columns:
            connection.execute(text("UPDATE todos SET title = content WHERE title = ''"))

        if "is_completed" in columns:
            connection.execute(text("UPDATE todos SET completed = is_completed WHERE completed = 0"))

        # Rebuild old local tables so legacy NOT NULL columns do not block new inserts.
        if "content" in columns or "is_completed" in columns:
            connection.execute(
                text(
                    """
                    CREATE TABLE todos_new (
                        id INTEGER NOT NULL,
                        title VARCHAR NOT NULL,
                        completed BOOLEAN NOT NULL,
                        date_key VARCHAR NOT NULL,
                        PRIMARY KEY (id)
                    )
                    """
                )
            )
            connection.execute(
                text(
                    """
                    INSERT INTO todos_new (id, title, completed, date_key)
                    SELECT id, title, completed, date_key
                    FROM todos
                    """
                )
            )
            connection.execute(text("DROP TABLE todos"))
            connection.execute(text("ALTER TABLE todos_new RENAME TO todos"))
            connection.execute(text("CREATE INDEX ix_todos_date_key ON todos (date_key)"))
            connection.execute(text("CREATE INDEX ix_todos_id ON todos (id)"))


sync_todo_table_schema()

app = FastAPI(title="Todo API")

# Allow the Next.js frontend to call this API during local development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


DbSession = Annotated[Session, Depends(get_db)]


@app.get("/")
def root():
    return {"message": "Todo API is running"}


@app.get("/todos", response_model=list[TodoResponse])
def get_todos(
    db: DbSession,
    date_key: str | None = Query(default=None, description="Filter Todos by YYYY-MM-DD date key"),
):
    """Return every Todo, optionally filtered by the selected date."""
    query = db.query(Todo)
    if date_key is not None:
        query = query.filter(Todo.date_key == date_key)

    return query.order_by(Todo.id.desc()).all()


@app.post("/todos", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(todo_create: TodoCreate, db: DbSession):
    """Create a Todo for the selected date."""
    todo = Todo(
        title=todo_create.title,
        date_key=todo_create.date_key,
        completed=todo_create.completed,
    )

    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@app.put("/todos/{id}", response_model=TodoResponse)
def update_todo(id: int, todo_update: TodoUpdate, db: DbSession):
    """Update only the fields provided by the client."""
    todo = db.query(Todo).filter(Todo.id == id).first()
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")

    update_data = todo_update.model_dump(exclude_unset=True)
    for field_name, field_value in update_data.items():
        setattr(todo, field_name, field_value)

    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/todos/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(id: int, db: DbSession):
    """Delete a Todo by id."""
    todo = db.query(Todo).filter(Todo.id == id).first()
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")

    db.delete(todo)
    db.commit()
    return None
