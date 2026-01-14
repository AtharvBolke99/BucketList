import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [bucketList, setBucketList] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [newBucketList, setNewBucketList] = useState({
    name: "",
    description: "",
    priority: 0,
  });

  const CompletedTask = async (id) => {
    await axios.patch(
      `http://localhost:8080/bucketlists/${id}/complete`);
      getBucketLists();
      setIsCompleted(true);
  };

  const getBucketLists = async () => {
    const response = await axios.get(`http://localhost:8080/bucketlists`);
    setBucketList(response.data.data);
  };

  const addBucketList = async () => {
    await axios.post(`http://localhost:8080/bucketlists`, newBucketList);
    getBucketLists();
    setNewBucketList({ name: "", description: "", priority: 0 });
  };

  useEffect(() => {
    getBucketLists();
  }, []);

  return (
    <div>
      <h1>BucketList App</h1>

      {bucketList.map((item) => {
        const { _id, name, description, priority, isCompleted } = item;
        return (
          <div key={_id}>
            <span>{isCompleted ? "✅" : "❌"}</span>
            {isCompleted ? <h3>{name}</h3> : <h3><del>{name}</del></h3>}
            <h4>{description}</h4>
            <button onClick={() => {
              CompletedTask(_id);
            }}>Complete</button>
          </div>
        );
      })}

      <input
        type="text"
        placeholder="enter the bucketlist"
        value={newBucketList.name}
        onChange={(e) => {
          setNewBucketList({ ...newBucketList, name: e.target.value });
        }}
      />
      <input
        type="text"
        placeholder="enter the description"
        value={newBucketList.description}
        onChange={(e) => {
          setNewBucketList({ ...newBucketList, description: e.target.value });
        }}
      />

      <input
        type="number"
        placeholder="enter the priority"
        value={newBucketList.priority}
        onChange={(e) => {
          setNewBucketList({ ...newBucketList, priority: e.target.value });
        }}
      />

      <button onClick={addBucketList}>Add BucketList</button>
    </div>
  );
}

export default App;
