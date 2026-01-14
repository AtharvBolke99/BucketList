import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [bucketList, setBucketList] = useState([]);
  const [newBucketList, setNewBucketList] = useState({
    name: "",
    description: "",
    priority: 0,
  });
  const [loading, setLoading] = useState(false);

  const completeTask = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BASE_URL}/bucketlists/${id}/complete`);
      await getBucketLists();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const getBucketLists = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/bucketlists`);
      const sortedList = response.data.data.sort((a, b) => {
        if (a.iscompleted !== b.iscompleted) {
          return a.iscompleted ? 1 : -1; // Incomplete first
        }
        return b.priority - a.priority; // Higher priority first
      });
      setBucketList(sortedList);
    } catch (error) {
      console.error("Error fetching bucket lists:", error);
    }
  };

  const addBucketList = async () => {
    if (!newBucketList.name.trim() || !newBucketList.description.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/bucketlists`, newBucketList);
      await getBucketLists();
      setNewBucketList({ name: "", description: "", priority: 0 });
    } catch (error) {
      console.error("Error adding bucket list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBucketLists();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Bucket List</h1>
      </header>

      <main className="main">
        <div className="bucket-list">
          {bucketList.map((item) => {
            const { _id, name, description, priority, iscompleted } = item;
            return (
              <div key={_id} className={`bucket-item ${iscompleted ? 'completed' : ''}`}>
                <div className="item-content">
                  <h3 className="item-title">{name}</h3>
                  <p className="item-description">{description}</p>
                  <span className="item-priority">Priority: {priority}</span>
                </div>
                {!iscompleted && (
                  <button className="complete-btn" onClick={() => completeTask(_id)}>
                    Complete
                  </button>
                )}
                {iscompleted && <span className="completed-badge">✓ Completed</span>}
              </div>
            );
          })}
        </div>

        <form className="add-form" onSubmit={(e) => { e.preventDefault(); addBucketList(); }}>
          <input
            type="text"
            placeholder="Bucket list item"
            value={newBucketList.name}
            onChange={(e) => setNewBucketList({ ...newBucketList, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newBucketList.description}
            onChange={(e) => setNewBucketList({ ...newBucketList, description: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Priority (0-10)"
            value={newBucketList.priority}
            onChange={(e) => setNewBucketList({ ...newBucketList, priority: parseInt(e.target.value) || 0 })}
            min="0"
            max="10"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
