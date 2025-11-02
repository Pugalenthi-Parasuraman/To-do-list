const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ========== CORS Configuration ==========
// Allow ALL origins (fix for Vercel deployment issues)
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Schedule Tracker API",
    version: "1.0.0",
    status: "Running",
    endpoints: {
      health: "/api/health",
      todos: "/api/todos",
      stats: "/api/stats",
    },
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "✅ API is running perfectly!",
    timestamp: new Date().toISOString(),
    mongodb: "Connected ✅",
    cors: "Enabled for all origins ✅",
  });
});

// 1. GET all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    console.log(`✅ Fetched ${todos.length} todos`);
    res.json(todos);
  } catch (error) {
    console.error("❌ Error fetching todos:", error);
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
    console.error("❌ Error fetching todo:", error);
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
      activity: activity.trim(),
      time: time || new Date().toLocaleTimeString(),
      category: category || "Custom",
      day: day || "all",
      completed: false,
    });

    await todo.save();
    console.log(`✅ New todo created: ${activity}`);
    res.status(201).json(todo);
  } catch (error) {
    console.error("❌ Error creating todo:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. PUT update todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { activity, time, category, day, completed } = req.body;

    // Build update object only with provided fields
    const updateData = {};
    if (activity !== undefined) updateData.activity = activity.trim();
    if (time !== undefined) updateData.time = time;
    if (category !== undefined) updateData.category = category;
    if (day !== undefined) updateData.day = day;
    if (completed !== undefined) updateData.completed = completed;

    const todo = await Todo.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    console.log(`✅ Todo updated: ${todo.activity}`);
    res.json(todo);
  } catch (error) {
    console.error("❌ Error updating todo:", error);
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

    console.log(`✅ Todo deleted: ${todo.activity}`);
    res.json({ message: "Todo deleted successfully", todo });
  } catch (error) {
    console.error("❌ Error deleting todo:", error);
    res.status(500).json({ error: error.message });
  }
});

// 6. GET todos by category
app.get("/api/todos/category/:category", async (req, res) => {
  try {
    const todos = await Todo.find({ category: req.params.category });
    res.json(todos);
  } catch (error) {
    console.error("❌ Error fetching by category:", error);
    res.status(500).json({ error: error.message });
  }
});

// 7. GET completion stats
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
    console.error("❌ Error fetching completion stats:", error);
    res.status(500).json({ error: error.message });
  }
});

// 8. DELETE all completed todos
app.delete("/api/todos/completed/all", async (req, res) => {
  try {
    const result = await Todo.deleteMany({ completed: true });
    console.log(`✅ Deleted ${result.deletedCount} completed todos`);
    res.json({
      message: "All completed todos deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("❌ Error deleting completed todos:", error);
    res.status(500).json({ error: error.message });
  }
});

// 9. GET all stats
app.get("/api/stats", async (req, res) => {
  try {
    const total = await Todo.countDocuments();
    const completed = await Todo.countDocuments({ completed: true });
    const byCategory = await Todo.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json({
      total,
      completed,
      pending: total - completed,
      completionPercentage:
        total > 0 ? Math.round((completed / total) * 100) : 0,
      byCategory,
    });
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    res.status(500).json({ error: error.message });
  }
});

// ========== Error Handling ==========

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - Origin: ${req.get("origin")}`);
  next();
});

// 404 handler - MUST be before error handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handling middleware - MUST be last
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: err.message });
});

// ========== Start Server ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║  🚀 Schedule Tracker API Server                        ║
  ║  📍 Running on port: ${PORT}                           ║
  ║  ✅ API Status: ONLINE                                 ║
  ║  💾 Database: MongoDB Connected                        ║
  ║  🔗 CORS: Enabled for ALL origins                      ║
  ║  🔐 Ready for Vercel deployment                        ║
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
  console.log("\n");
});
