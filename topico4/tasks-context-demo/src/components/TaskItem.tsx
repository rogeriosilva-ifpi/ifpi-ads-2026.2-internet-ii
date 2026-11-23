import { useState } from 'react';
import type { Task } from '../types';
import TaskActions from './TaskActions';

type TaskItemProps = {
  task: Task;
  onChangeTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void; // 🚚 só repassa
};

// TaskItem usa onChangeTask (checkbox e edição)
// 🚚 ...mas onDeleteTask ele só REPASSA para TaskActions.
export default function TaskItem({ task, onChangeTask, onDeleteTask }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li className="task-item">
      <label>
        <input
          type="checkbox"
          checked={task.done}
          onChange={(e) => onChangeTask({ ...task, done: e.target.checked })}
        />
        {isEditing ? (
          <input
            type="text"
            value={task.text}
            autoFocus
            onChange={(e) => onChangeTask({ ...task, text: e.target.value })}
          />
        ) : (
          <span className={task.done ? 'done' : ''}>{task.text}</span>
        )}
      </label>

      <TaskActions
        task={task}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onDeleteTask={onDeleteTask}
      />
    </li>
  );
}
