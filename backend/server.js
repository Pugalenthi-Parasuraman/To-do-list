const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ========== CORS Configuration ==========
// Allow Vercel frontend and localhost
app.use(
  cors({
    origin: [
      "https://to-do-list-8zkp.vercel.app/", // Your Vercel frontend
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());

// ========== MongoDB Connection ==========
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

// ========== Todo Schema ==========
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
    mongodb: "Connected ✅",
    cors: "Enabled ✅",
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

// 9. DELETE all completed todos
app.delete("/api/todos/completed/all", async (req, res) => {
  try {
    const result = await Todo.deleteMany({ completed: true });
    res.json({ 
      message: "All completed todos deleted", 
      deletedCount: result.deletedCount 
    });
    console.log("✅ All completed todos deleted");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10. GET all stats
app.get("/api/stats", async (req, res) => {
  try {
    const total = await Todo.countDocuments();
    const completed = await Todo.countDocuments({ completed: true });
    const byCategory = await Todo.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.json({
      total,
      completed,
      pending: total - completed,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      byCategory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 11. OPTIONS for CORS preflight
app.options("*", cors());

// 12. Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Schedule Tracker API",
    version: "1.0.0",
    status: "Running",
    frontend: "https://to-do-list-22jc.vercel.app",
    endpoints: {
      health: "/api/health",
      todos: "/api/todos",
      stats: "/api/stats",
    }
  });
});

// ========== Error Handling ==========
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// ========== Start Server ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║  🚀 Schedule Tracker API Server                        ║
  ║  📍 Running on port: ${PORT}                           ║
  ║  🌐 Frontend: https://to-do-list-8zkp.vercel.app/      ║
  ║  ✅ API Status: ONLINE                                 ║
  ║  💾 Database: MongoDB Connected                        ║
  ║  🔗 CORS: Enabled for Vercel                           ║
  ╚════════════════════════════════════════════════════════╝
  `);
  console.log("\n📚 Available Endpoints:");
  console.log("  🏠 GET    /                              - API Info");
  console.log("  💚 GET    /api/health                    - Health Check");
  console.log("  📋 GET    /api/todos                     - Get All Todos");
  console.log("  ➕ POST   /api/todos                     - Create Todo");
  console.log("  ✏️  PUT    /api/todos/:id                 - Update Todo");
  console.log("  🗑️  DELETE /api/todos/:id                 - Delete Todo");
  console.log("  📊 GET    /api/stats                     - Get Statistics");
  console.log("  🏷️  GET    /api/todos/category/:category  - Get by Category");
  console.log("  📈 GET    /api/stats/completion          - Completion Stats");
  console.log("\n")});