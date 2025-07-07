import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [input, setInput] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState('');

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
    const newTask = { text: input, date, time, priority };

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
    setPriority('Medium');
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const clearTasks = () => {
    if (window.confirm("Are you sure you want to clear all tasks?")) {
      setTasks([]);
    }
  };

  const editTask = (index) => {
    const task = tasks[index];
    setInput(task.text);
    setDate(task.date);
    setTime(task.time);
    setPriority(task.priority);
    setEditIndex(index);
  };

  const isLate = (taskDate, taskTime) => {
    return new Date(`${taskDate}T${taskTime}`) < new Date();
  };

  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(search.toLowerCase())
  );

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div style={styles.container}>
      <h2> My To-Do List</h2>
      <p style={{ color: '#555', marginBottom: '20px' }}> {getCurrentDateTime()}</p>

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
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        style={styles.input}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
      <button onClick={addTask} style={styles.button}>{editIndex !== null ? 'Update' : 'Add'}</button>
      <button onClick={clearTasks} style={styles.clearBtn}>Clear All</button>

      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ ...styles.input, width: '40%' }}
      />

      <ul style={styles.list}>
        {filteredTasks.map((task, index) => (
          <li key={index} style={styles.listItem}>
            <div>
              <strong>{task.text}</strong><br />
              <small>{task.date} at {task.time}</small><br />
              <span style={{ color: task.priority === 'High' ? 'red' : task.priority === 'Medium' ? '#ff9900' : 'green' }}>
                Priority: {task.priority}
              </span><br />
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
  container: {
    padding: 20,
    textAlign: 'center',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    background: '#f9f9f9',
    minHeight: '100vh'
  },
  input: {
    padding: 10,
    width: '20%',
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 4,
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px 20px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  },
  clearBtn: {
    padding: '10px 20px',
    background: '#888',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    marginLeft: 10
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginTop: 20
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '10px auto',
    padding: '15px 20px',
    width: '70%',
    background: 'white',
    borderRadius: 8,
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  deleteBtn: {
    background: 'red',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    marginLeft: '5px',
    borderRadius: 4
  },
  editBtn: {
    background: '#ffcc00',
    color: 'black',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: 4
  }
};

export default App;
