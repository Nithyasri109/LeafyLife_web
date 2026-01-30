import React, { useEffect, useState } from "react";
import axios from "axios";
import PlantCard from "./PlantCard";
import "./App.css";
import Addplant from "./Addplant";
import Login from "./Login";

function App() {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const loadPlants = async () => {
    const res = await axios.get("http://localhost:4000/api/plants");
    setPlants(res.data);
  };

  const waterPlant = async (id) => {
    await axios.post(`http://localhost:4000/api/plants/${id}/water`);
    loadPlants();
  };

  const deletePlant = async (id) => {
    if (!window.confirm("Delete this plant?")) return;
    await axios.delete(`http://localhost:4000/api/plants/${id}`);
    loadPlants();
  };

 
  const getReminderInfo = (plant) => {
    const last = new Date(plant.lastWatered);
    const interval = plant.interval || 7;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    last.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (today - last) / (1000 * 60 * 60 * 24)
    );

    const daysLeft = interval - diffDays;

    if (daysLeft < 0) return { status: "overdue", daysLeft };
    if (daysLeft === 0) return { status: "today", daysLeft };

    return { status: "upcoming", daysLeft };
  };

  useEffect(() => {
    if (loggedIn) {
      loadPlants();
    }
  }, [loggedIn]);

  useEffect(() => {
    if (!loggedIn) return;

    const todayKey = new Date().toDateString();

    plants.forEach((plant) => {
      const { status } = getReminderInfo(plant);

      if (status === "today") {
        const key = `reminded-${plant._id}-${todayKey}`;
        if (!localStorage.getItem(key)) {
          alert(`🌿 Today is watering day for ${plant.name}`);
          localStorage.setItem(key, "true");
        }
      }
    });
  }, [plants, loggedIn]);

  const filteredPlants = plants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const healthyCount = plants.filter(
    (p) => getReminderInfo(p).status === "upcoming"
  ).length;

  const todayCount = plants.filter(
    (p) => getReminderInfo(p).status === "today"
  ).length;

  const overdueCount = plants.filter(
    (p) => getReminderInfo(p).status === "overdue"
  ).length;

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-bg">
      <div className="container">
        <header className="hero">
          <div className="logo">🌿 LeafyLife</div>
          <button
    className="logout-btn"
    onClick={() => {
      localStorage.removeItem("loggedIn");
      setLoggedIn(false); 
    }}
  >
    Logout
  </button>

          <h1>
            Never forget to water <span>your plants again</span>
          </h1>

        </header>
        
        <div className="stats-row">
          <div className="stat green">Healthy <strong>{healthyCount}</strong></div>
          <div className="stat yellow">Water Today <strong>{todayCount}</strong></div>
          <div className="stat red">Overdue <strong>{overdueCount}</strong></div>
        </div>

        <div className="controls">
          <input
            placeholder="Search plants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="add-btn" onClick={() => setShowModal(true)}>
            + Add Plant
          </button>
        </div>

        {showModal && (
          <Addplant
            onClose={() => setShowModal(false)}
            onPlantAdded={loadPlants}
          />
        )}

        <div className="plants-grid">
          {filteredPlants.map((plant) => {
            const reminderInfo = getReminderInfo(plant);

            return (
              <PlantCard
                key={plant._id}
                plant={{ ...plant, ...reminderInfo }}
                onWater={waterPlant}
                onDelete={deletePlant}
              />
            );
          })}
        </div>
        <footer className="footer">© LeafyLife • Made with 💚 for plant lover</footer>
      </div>
    </div>
  );
}

export default App;
