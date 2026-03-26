import { useEffect, useState } from "react";
import { getMappings, addMapping, deleteMapping } from "../api";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [channelId, setChannelId] = useState("");

  // 🔄 Load mappings
  async function load() {
    try {
      const res = await getMappings();
      setData(res);
    } catch (err) {
      console.error("Error loading mappings:", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // ➕ Add mapping
  async function handleAdd() {
    if (!roomId || !channelId) {
      alert("Enter both Room ID and Channel ID");
      return;
    }

    try {
      await addMapping(roomId, channelId);
      setRoomId("");
      setChannelId("");
      load();
    } catch (err) {
      console.error("Add error:", err);
    }
  }

  // ❌ Delete mapping
  async function handleDelete(id) {
    try {
      await deleteMapping(id);
      load();
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  // 🚪 Logout
  function logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  return (
    <div className="dashboard">

      <h2>🚀 Bridge Dashboard</h2>

      <button className="logout" onClick={logout}>
        Logout
      </button>

      {/* ➕ Add Mapping Form */}
      <div className="form">
        <input
          placeholder="Matrix Room ID (!roomid:matrix.org)"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <input
          placeholder="Discord Channel ID"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
        />

        <button onClick={handleAdd}>Add</button>
      </div>

      {/* 📋 Mapping List */}
      <div className="list">
        {data.length === 0 ? (
          <p>No mappings yet</p>
        ) : (
          data.map((m) => (
            <div key={m._id} className="item">
              <span>
                {m.channelId} → {m.roomId}
              </span>

              <button onClick={() => handleDelete(m._id)}>
                ❌ Remove
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
