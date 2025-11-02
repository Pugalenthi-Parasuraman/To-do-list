const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

connectDB();

// Todo Schema
const todoSchema = new mongoose.Schema({
  activity: {
    type: String,
    required: true,
  },
  time: String,
  category: String,
  completed: {
    type: Boolean,
    default: false,
  },
  day: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Todo = mongoose.model("Todo", todoSchema);

// ========== API ROUTES ==========

// 1. GET all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
    console.log("✅ Fetched all todos");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET single todo by ID
app.get("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST create new todo
app.post("/api/todos", async (req, res) => {
  try {
    const { activity, time, category, day } = req.body;

    if (!activity) {
      return res.status(400).json({ error: "Activity is required" });
    }

    const todo = new Todo({
      activity,
      time: time || new Date().toLocaleTimeString(),
      category: category || "Custom",
      day: day || "all",
      completed: false,
    });

    await todo.save();
    res.json(todo);
    console.log("✅ New todo created:", activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. PUT update todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
    console.log("✅ Todo updated:", req.body.activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. DELETE todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully", todo });
    console.log("✅ Todo deleted");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "API is running perfectly!",
    timestamp: new Date().toISOString(),
  });
});

// 7. GET todos by category
app.get("/api/todos/category/:category", async (req, res) => {
  try {
    const todos = await Todo.find({ category: req.params.category });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. GET completed todos count
app.get("/api/stats/completion", async (req, res) => {
  try {
    const total = await Todo.countDocuments();
    const completed = await Todo.countDocuments({ completed: true });
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      total,
      completed,
      remaining: total - completed,
      completionPercentage: percentage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔═════════════════════════════════════╗
  ║  🚀 Server is running on port ${PORT}  ║
  ║  📍 http://localhost:${PORT}         ║
  ║  ✅ API Status: ONLINE              ║
  ╚═════════════════════════════════════╝
  `);
  console.log("Available endpoints:");
  console.log("  GET  http://localhost:5000/api/todos");
  console.log("  POST http://localhost:5000/api/todos");
  console.log("  PUT  http://localhost:5000/api/todos/:id");
  console.log("  DELETE http://localhost:5000/api/todos/:id");
  console.log("  GET  http://localhost:5000/api/health");
});
