import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [input, setInput] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const isFutureDateTime = (d, t) => {
    const taskDateTime = new Date(`${d}T${t}`);
    return taskDateTime > new Date();
  };

  const addTask = () => {
    if (input.trim() === '' || date.trim() === '' || time.trim() === '') return;
    if (!isFutureDateTime(date, time)) {
      alert("Please select a future date and time.");
      return;
    }
    const newTask = { text: input, date, time };

    let updatedTasks;
    if (editIndex !== null) {
      updatedTasks = [...tasks];
      updatedTasks[editIndex] = newTask;
      setEditIndex(null);
    } else {
      updatedTasks = [...tasks, newTask];
    }

    updatedTasks.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    setTasks(updatedTasks);
    setInput('');
    setDate('');
    setTime('');
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const editTask = (index) => {
    const task = tasks[index];
    setInput(task.text);
    setDate(task.date);
    setTime(task.time);
    setEditIndex(index);
  };

  const isLate = (taskDate, taskTime) => {
    return new Date(`${taskDate}T${taskTime}`) < new Date();
  };

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
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={styles.input}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        style={styles.input}
      />
      <button onClick={addTask} style={styles.button}>{editIndex !== null ? 'Update' : 'Add'}</button>

      <ul style={styles.list}>
        {tasks.map((task, index) => (
          <li key={index} style={styles.listItem}>
            <div>
              <strong>{task.text}</strong><br />
              <small>{task.date} at {task.time}</small><br />
              {isLate(task.date, task.time) && <span style={{ color: 'red' }}>Late</span>}
            </div>
            <div>
              <button onClick={() => editTask(index)} style={styles.editBtn}>Edit</button>
              <button onClick={() => deleteTask(index)} style={styles.deleteBtn}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { padding: 20, textAlign: 'center' },
  input: { padding: 10, width: '20%', marginRight: 10, marginBottom: 10 },
  button: { padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none' },
  list: { listStyle: 'none', padding: 0, marginTop: 20 },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    cursor: 'pointer',
    marginLeft: '5px'
  },
  editBtn: {
    background: '#ffcc00',
    color: 'black',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer'
  }
};

export default App;
