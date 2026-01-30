import axios from "axios";
import { useState } from "react";
import "./Addplant.css";

export default function Addplant({ onClose, onPlantAdded }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [frequency, setFrequency] = useState("");
  const [image, setImage] = useState(null);
  const [lastWatered, setLastWatered] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [careTip, setCareTip] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("interval", Number(frequency));
    formData.append("lastWatered", lastWatered);
    formData.append("careTip", careTip);
    if (image) {
      formData.append("image", image);
    }

    await axios.post("http://localhost:4000/api/plants", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    onPlantAdded();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add New Plant 🌱</h2>

        <form onSubmit={handleSubmit}>
          <label>Plant Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} />

          <label>Care Tip</label>
          <select value={careTip} onChange={(e) => setCareTip(e.target.value)}>
            <option value="">Select Care Tip</option>
            <option value="Keep away from direct sunlight">Keep away from direct sunlight</option>
            <option value="Needs bright light">Needs bright light</option>
            <option value="Water once a week">Water once a week</option>
            <option value="Low light tolerant">Low light tolerant</option>
          </select>

          <label>Water Every (days)</label>
          <input
            type="number"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />

          <label>Last Watered</label>
          <input
            type="date"
            value={lastWatered}
            onChange={(e) => setLastWatered(e.target.value)}
          />

          <label>Plant Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save Plant</button>
          </div>
        </form>
      </div>
    </div>
  );
}
