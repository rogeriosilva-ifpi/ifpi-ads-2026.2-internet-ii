import { useState, type FormEvent } from 'react';
import { useTasksDispatch } from '../context/TasksContext';

let nextId = 5;

// Só precisa disparar ações → consome apenas o dispatch.
export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!text.trim()) return;
    // O TS valida o formato da ação: tente trocar 'added' por 'add'.
    dispatch({ type: 'added', id: nextId++, text: text.trim() });
    setText('');
  }

  return (
    <form className="add-task" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nova tarefa..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="primary" type="submit">
        Adicionar
      </button>
    </form>
  );
}
