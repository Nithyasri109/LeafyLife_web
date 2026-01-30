import React from "react";


export default function PlantCard({ plant, onWater, onDelete }) {
  const { status, daysLeft, interval = 7, careTip,location } = plant;

  const progress =
    status === "overdue"
      ? 100
      : status === "today"
      ? 95
      : ((interval - daysLeft) / interval) * 100;

  return (
    <div className={`plant-card ${status}`}>
      <div className="card-header">
        <span className="plant-icon"></span>

        <div className="card-actions">
          {status === "overdue" ? (
            <span className="status-pill overdue">⏰ Overdue for water</span>
          ) : status === "today" ? (
            <span className="status-pill today">💧 Water today</span>
          ) : (
            <span className="status-pill ok">
              💧 Water in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
            </span>
          )}

          <button className="delete-btn" onClick={() => onDelete(plant._id)}>
            🗑️
          </button>
        </div>
      </div><br></br>
{plant.image && (
  <img
    src={`http://localhost:4000/uploads/${plant.image}`}
    alt={plant.name}
    className="plant-img"
  />
)}
      <h3 className="plant-name top">{plant.name}</h3>

      {location && (
        <p className="plant-location">📍 {location}</p>
      )}

      <p className="plant-subtext">
        {status === "overdue"
          ? "Needs watering immediately"
          : status === "today"
          ? "Water today"
          : `Water in ${daysLeft} days`}
      </p>

      <div className="progress-bar">
        <div
          className={`progress-fill ${status}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {careTip && (
        <div className="care-tip">🌤️ {careTip}</div>
      )}

      <button className="water-btn" onClick={() => onWater(plant._id)}>
        💧 Water Now
      </button>
    </div>
  );
}
