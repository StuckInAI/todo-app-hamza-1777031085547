'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return createClient(url, key);
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type FilterType = 'all' | 'active' | 'completed';

function TodoInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) {
          onAdd(value);
          setValue('');
        }
      }}
      className="flex gap-3"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 placeholder-gray-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-150"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-violet-600 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-md transition-all duration-150"
      >
        Add
      </button>
    </form>
  );
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const submitEdit = () => {
    if (editText.trim()) onEdit(todo.id, editText);
    setEditing(false);
  };

  return (
    <div className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-50/70 transition-colors duration-100">
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed
            ? 'bg-gradient-to-br from-violet-500 to-indigo-600 border-transparent'
            : 'border-gray-300 hover:border-violet-400'
        }`}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
      {editing ? (
        <input
          autoFocus
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={submitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitEdit();
            if (e.key === 'Escape') {
              setEditText(todo.text);
              setEditing(false);
            }
          }}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 rounded-lg border border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
        />
      ) : (
        <span
          className={`flex-1 text-sm font-medium transition-all duration-150 ${
            todo.completed ? 'line-through text-gray-300' : 'text-gray-700'
          }`}
        >
          {todo.text}
        </span>
      )}
      {!editing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => { setEditing(true); setEditText(todo.text); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-violet-500 hover:bg-violet-50 transition-colors duration-100"
            aria-label="Edit task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-100"
            aria-label="Delete task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

function TodoList({
  todos,
  onToggle,
  onDelete,
  onEdit,
}: {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}) {
  if (todos.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-300 text-sm font-medium">No tasks here</p>
      </div>
    );
  }
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
        </li>
      ))}
    </ul>
  );
}

function TodoFilter({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
}: {
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  activeCount: number;
  completedCount: number;
}) {
  return (
    <div className="flex gap-1">
      {([
        { label: 'All', value: 'all' as FilterType, count: activeCount + completedCount },
        { label: 'Active', value: 'active' as FilterType, count: activeCount },
        { label: 'Done', value: 'completed' as FilterType, count: completedCount },
      ]).map((btn) => (
        <button
          key={btn.value}
          onClick={() => onFilterChange(btn.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
            filter === btn.value
              ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          {btn.label}
          <span
            className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-xs ${
              filter === btn.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {btn.count}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = getSupabaseClient();
        const { data, error: fetchError } = await supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false });
        if (fetchError) {
          setError('Failed to load todos. Please try again.');
          console.error('Fetch error:', fetchError);
        } else if (data) {
          setTodos(
            data.map((t: any) => ({
              id: t.id,
              text: t.text,
              completed: t.completed,
              createdAt: new Date(t.created_at),
            }))
          );
        }
      } catch (e) {
        setError('Failed to connect to database.');
        console.error(e);
      }
      setLoading(false);
    })();
  }, []);

  const addTodo = async (text: string) => {
    if (!text.trim()) return;
    try {
      const supabase = getSupabaseClient();
      const { data, error: insertError } = await supabase
        .from('todos')
        .insert([{ text: text.trim(), completed: false }])
        .select()
        .single();
      if (insertError) {
        setError('Failed to add todo.');
        console.error('Insert error:', insertError);
        return;
      }
      if (data) {
        setTodos((prev) => [
          { id: data.id, text: data.text, completed: data.completed, createdAt: new Date(data.created_at) },
          ...prev,
        ]);
      }
    } catch (e) {
      setError('Failed to add todo.');
      console.error(e);
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const supabase = getSupabaseClient();
      const { error: updateError } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);
      if (updateError) {
        setError('Failed to update todo.');
        console.error('Toggle error:', updateError);
        return;
      }
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    } catch (e) {
      setError('Failed to update todo.');
      console.error(e);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const supabase = getSupabaseClient();
      const { error: deleteError } = await supabase.from('todos').delete().eq('id', id);
      if (deleteError) {
        setError('Failed to delete todo.');
        console.error('Delete error:', deleteError);
        return;
      }
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError('Failed to delete todo.');
      console.error(e);
    }
  };

  const editTodo = async (id: string, text: string) => {
    if (!text.trim()) return;
    try {
      const supabase = getSupabaseClient();
      const { error: editError } = await supabase
        .from('todos')
        .update({ text: text.trim() })
        .eq('id', id);
      if (editError) {
        setError('Failed to edit todo.');
        console.error('Edit error:', editError);
        return;
      }
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: text.trim() } : t)));
    } catch (e) {
      setError('Failed to edit todo.');
      console.error(e);
    }
  };

  const clearCompleted = async () => {
    const ids = todos.filter((t) => t.completed).map((t) => t.id);
    if (ids.length === 0) return;
    try {
      const supabase = getSupabaseClient();
      const { error: clearError } = await supabase.from('todos').delete().in('id', ids);
      if (clearError) {
        setError('Failed to clear completed todos.');
        console.error('Clear error:', clearError);
        return;
      }
      setTodos((prev) => prev.filter((t) => !t.completed));
    } catch (e) {
      setError('Failed to clear completed todos.');
      console.error(e);
    }
  };

  const filteredTodos = todos.filter((t) =>
    filter === 'active' ? !t.completed : filter === 'completed' ? t.completed : true
  );
  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen flex items-start justify-center pt-16 pb-12 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">My Todos</h1>
          <p className="text-gray-500 mt-2 text-sm">
            {loading
              ? 'Loading...'
              : activeCount === 0 && completedCount === 0
              ? 'Add your first task below'
              : `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`}
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-3 text-red-400 hover:text-red-600 transition-colors"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <TodoInput onAdd={addTodo} />
          </div>
          {todos.length > 0 && (
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50">
              <TodoFilter
                filter={filter}
                onFilterChange={setFilter}
                activeCount={activeCount}
                completedCount={completedCount}
              />
            </div>
          )}
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading tasks...
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              <TodoList
                todos={filteredTodos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            </div>
          )}
          {completedCount > 0 && !loading && (
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <button
                onClick={clearCompleted}
                className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors duration-150"
              >
                Clear completed ({completedCount})
              </button>
            </div>
          )}
        </div>

        {!loading && todos.length === 0 && (
          <div className="text-center mt-10 text-gray-400">
            <p className="text-sm">✨ Start fresh — add a task to get going!</p>
          </div>
        )}
      </div>
    </main>
  );
}
