import React, { useState, useEffect } from 'react';

const FocusSounds = () => {
    const [audio, setAudio] = useState(null);
  
    const playSound = (soundFile) => {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(`/${soundFile}.mp3`);
      newAudio.play();
      setAudio(newAudio);
    };
  
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-xl font-bold mb-4">🎧 Focus Sounds</h3>
        <ul>
          <li className="flex justify-between items-center mb-2">
            <span>Rain</span>
            <button onClick={() => playSound('rain')} className="bg-custom-orange text-white px-3 py-1 rounded">Play</button>
          </li>
          <li className="flex justify-between items-center mb-2">
            <span>Forest</span>
            <button onClick={() => playSound('forest')} className="bg-custom-orange text-white px-3 py-1 rounded">Play</button>
          </li>
          <li className="flex justify-between items-center">
            <span>Lo-fi</span>
            <button onClick={() => playSound('lofi')} className="bg-custom-orange text-white px-3 py-1 rounded">Play</button>
          </li>
        </ul>
      </div>
    );
  };
  
  const TodaysTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
  
    useEffect(() => {
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      setTasks(savedTasks);
    }, []);
  
    useEffect(() => {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
      if (newTask.trim()) {
        setTasks([...tasks, { text: newTask, completed: false }]);
        setNewTask('');
      }
    };
  
    const toggleTask = (index) => {
      const newTasks = [...tasks];
      newTasks[index].completed = !newTasks[index].completed;
      setTasks(newTasks);
    };
  
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4">💡 Today's Tasks</h3>
        <div className="flex mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded text-white mr-2"
            placeholder="+ Add Task"
          />
          <button onClick={addTask} className="bg-custom-orange text-white px-4 py-2 rounded">Add</button>
        </div>
        <ul>
          {tasks.map((task, index) => (
            <li key={index} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(index)}
                className="mr-2"
              />
              <span className={task.completed ? 'line-through' : ''}>{task.text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

const SidebarWidgets = () => {
  return (
    <>
      <FocusSounds />
      <TodaysTasks />
    </>
  );
};

export default SidebarWidgets;




return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-4">
        <h3 className="text-white text-lg font-semibold mb-4">Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
            <StatWidget title="Pomodoros" value={stats.pomodoros} />
            <StatWidget title="Tasks Done" value={stats.tasksDone} />
            <StatWidget title="Focus Time" value={stats.focusTime} />
            <StatWidget title="Day Streak" value={stats.dayStreak} />
        </div>
    </div>
);