import { useState, type FormEvent } from 'react';

type AddTaskProps = {
  onAddTask: (text: string) => void;
};

// ✅ Usa onAddTask (veio de App → TaskBoard → AddTask)
export default function AddTask({ onAddTask }: AddTaskProps) {
  const [text, setText] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!text.trim()) return;
    onAddTask(text.trim());
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
