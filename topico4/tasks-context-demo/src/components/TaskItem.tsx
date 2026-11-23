import { useState } from 'react';
import type { Task } from '../types';
import { useTasksDispatch } from '../context/TasksContext';
import TaskActions from './TaskActions';

type TaskItemProps = {
  task: Task;
};

export default function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();

  function change(patch: Partial<Task>) {
    dispatch({ type: 'changed', task: { ...task, ...patch } });
  }

  return (
    <li className="task-item">
      <label>
        <input
          type="checkbox"
          checked={task.done}
          onChange={(e) => change({ done: e.target.checked })}
        />
        {isEditing ? (
          <input
            type="text"
            value={task.text}
            autoFocus
            onChange={(e) => change({ text: e.target.value })}
          />
        ) : (
          <span className={task.done ? 'done' : ''}>{task.text}</span>
        )}
      </label>

      <TaskActions
        task={task}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
      />
    </li>
  );
}
