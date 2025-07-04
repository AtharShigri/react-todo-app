import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [input, setInput] = useState('');

  const addTask = () => {
    if (input.trim() === '') return;
    const updatedTasks = [...tasks, input];
    setTasks(updatedTasks);
    setInput('');
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div style={styles.container}>
      <h2> My To-Do List</h2>
      <input
        type="text"
        placeholder="Enter task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={styles.input}
      />
      <button onClick={addTask} style={styles.button}>Add</button>

      <ul style={styles.list}>
        {tasks.map((task, index) => (
          <li key={index} style={styles.listItem}>
            {task}
            <button onClick={() => deleteTask(index)} style={styles.deleteBtn}> Delete </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { padding: 20, textAlign: 'center' },
  input: { padding: 10, width: '60%', marginRight: 10 },
  button: { padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none' },
  list: { listStyle: 'none', padding: 0, marginTop: 20 },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '5px auto',
    padding: '10px 20px',
    width: '60%',
    background: '#f1f1f1',
    borderRadius: 5
  },
  deleteBtn: {
    background: 'red',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer'
  }
};

export default App;
