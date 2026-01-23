const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
mongoose
  .connect("mongodb://localhost:27017/plantify")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastWatered: { type: Date, default: Date.now },
  interval: { type: Number, default: 7 },
  location: String,
  careTip: String,
  image: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const Plant = mongoose.model("Plant", plantSchema);
const User = mongoose.model("User", userSchema);

app.get("/api/plants", async (req, res) => {
  const plants = await Plant.find();

  const today = new Date();

  const updated = plants.map((plant) => {
    const last = new Date(plant.lastWatered);
    last.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    const diffDays = Math.floor(
      (today - last) / (1000 * 60 * 60 * 24)
    );

    const daysLeft = plant.interval - diffDays;

    let status = "upcoming";
    if (daysLeft < 0) status = "overdue";
    else if (daysLeft === 0) status = "today";

    return { ...plant.toObject(), daysLeft, status };
  });

  res.json(updated);
});

app.post("/api/plants", upload.single("image"), async (req, res) => {
  try {
    const plant = new Plant({
      name: req.body.name,
      location: req.body.location,
      interval: req.body.interval,
      lastWatered: req.body.lastWatered,
      careTip: req.body.careTip,
      image: req.file ? req.file.filename : null,
    });

    await plant.save();
    res.json(plant);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid plant data" });
  }
});

app.post("/api/plants/:id/water", async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  plant.lastWatered = new Date();
  await plant.save();
  res.json(plant);
});

app.delete("/api/plants/:id", async (req, res) => {
  await Plant.findByIdAndDelete(req.params.id);
  res.json({ message: "Plant deleted" });
});

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = new User({ name, email, password });
  await user.save();

  res.json({ message: "Signup successful" });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  res.json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});
app.listen(4000, () => {
  console.log("🚀 Backend running on http://localhost:4000");
});
