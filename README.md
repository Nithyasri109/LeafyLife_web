# 🌿 LeafyLife Web App

LeafyLife is a web-based plant watering reminder application that helps users manage plant care by tracking watering schedules, plant location, and care tips. The application notifies users when plants need watering and displays plant health status visually.

---

## 🛠️ Tech Stack

* **Frontend:** React, CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **API Type:** REST API
* **Version Control:** Git & GitHub

---

## ✨ Features

* Add plants with name, location, watering interval, and care tips
* Automatic watering reminders (Healthy / Water Today / Overdue)
* Visual progress bar for watering status
* Search plants by name
* Water plants digitally
* Delete plants
* Simple login system

---

## 🚀 Available Scripts (Frontend)

In the project directory, you can run:

### `npm install`

Installs all required dependencies.

### `npm start`

Runs the app in development mode.
Open **[http://localhost:3000](http://localhost:3000)** to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.

---

## ⚙️ Backend Setup

1. Navigate to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start backend server:

```bash
node server.js
```

Backend runs on:

```
http://localhost:4000
```

---

## 📡 API Endpoints

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| GET    | /api/plants           | Get all plants       |
| POST   | /api/plants           | Add a new plant      |
| POST   | /api/plants/:id/water | Update watering date |
| DELETE | /api/plants/:id       | Delete a plant       |

---

## 🌱 Purpose of the Project

LeafyLife promotes responsible plant care by helping users maintain consistent watering habits, supporting a greener and more sustainable lifestyle.
