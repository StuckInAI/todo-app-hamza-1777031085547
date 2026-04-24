'use client';

import { useState } from 'react';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import TodoFilter from '@/components/TodoFilter';
import { Todo, FilterType } from '@/types';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  const addTodo = (text: string) => {
    if (!text.trim()) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: string, newText: string) => {
    if (!newText.trim()) return;
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen flex items-start justify-center pt-16 pb-12 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">My Todos</h1>
          <p className="text-gray-500 mt-2 text-sm">
            {activeCount === 0 && completedCount === 0
              ? 'Add your first task below'
              : `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 overflow-hidden">
          {/* Input */}
          <div className="p-6 border-b border-gray-100">
            <TodoInput onAdd={addTodo} />
          </div>

          {/* Filter */}
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

          {/* List */}
          <div className="divide-y divide-gray-50">
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          </div>

          {/* Footer */}
          {completedCount > 0 && (
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

        {/* Empty State */}
        {todos.length === 0 && (
          <div className="text-center mt-10 text-gray-400">
            <p className="text-sm">✨ Start fresh — add a task to get going!</p>
          </div>
        )}
      </div>
    </main>
  );
}
