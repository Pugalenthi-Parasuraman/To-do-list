import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

export default function ProfessionalScheduleApp() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedDay, setSelectedDay] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCompleted, setFilterCompleted] = useState("all");
  const [showCompleted, setShowCompleted] = useState(false);
  const [completedDates, setCompletedDates] = useState({});
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const scheduleData = [
    {
      time: "5:00-5:30 AM",
      activity: "Wake Up & Morning Routine",
      category: "Health",
      day: "all",
    },
    {
      time: "5:30-6:30 AM",
      activity: "English Practice (Videos, Reading, Writing)",
      category: "English",
      day: "all",
    },
    {
      time: "6:30-7:30 AM",
      activity: "Kannada Practice & Tech News",
      category: "Kannada",
      day: "all",
    },
    {
      time: "7:30-8:30 AM",
      activity: "Interview Prep & HR Skills",
      category: "HR",
      day: "all",
    },
    {
      time: "8:30-9:00 AM",
      activity: "Tea Break & Rest",
      category: "Break",
      day: "all",
    },
    {
      time: "9:00-12:30 PM",
      activity: "QA Testing Focus - Learn & Practice",
      category: "Learning",
      day: "Mon,Wed,Fri",
    },
    {
      time: "9:00-12:30 PM",
      activity: "MERN Stack Focus - Code & Build",
      category: "Learning",
      day: "Tue,Thu,Sat",
    },
    {
      time: "12:30-1:30 PM",
      activity: "Lunch Break",
      category: "Break",
      day: "all",
    },
    {
      time: "1:30-2:00 PM",
      activity: "Rest / Power Nap",
      category: "Break",
      day: "all",
    },
    {
      time: "2:00-5:00 PM",
      activity: "Project Work (MERN + QA Testing)",
      category: "Projects",
      day: "all",
    },
    {
      time: "5:00-5:30 PM",
      activity: "Tea Break & Walk",
      category: "Break",
      day: "all",
    },
    {
      time: "5:30-6:30 PM",
      activity: "Soft Skills & Business Ideas",
      category: "Soft Skills",
      day: "all",
    },
    {
      time: "6:30-7:00 PM",
      activity: "Revision & Notes",
      category: "Revision",
      day: "all",
    },
    {
      time: "7:00-8:00 PM",
      activity: "Dinner & Family Time",
      category: "Break",
      day: "all",
    },
    {
      time: "8:00-9:00 PM",
      activity: "Advanced Learning (Optional)",
      category: "Learning",
      day: "all",
    },
    {
      time: "9:00-9:30 PM",
      activity: "Tomorrow Planning & Prepare",
      category: "Planning",
      day: "all",
    },
    {
      time: "9:30-10:00 PM",
      activity: "Sleep Preparation",
      category: "Sleep",
      day: "all",
    },
  ];

  const categories = [
    "Health",
    "English",
    "Kannada",
    "HR",
    "Break",
    "Learning",
    "Projects",
    "Soft Skills",
    "Revision",
    "Planning",
    "Sleep",
  ];

  // Format current date and time in IST (Kolkata/New Delhi)
  const getDayNameIST = (date) => {
    const istDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[istDate.getDay()];
  };

  const formatDateIST = (date) => {
    const istDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const options = { year: "numeric", month: "long", day: "numeric" };
    return istDate.toLocaleDateString("en-US", options);
  };

  const formatTimeIST = (date) => {
    const istDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const hours = String(istDate.getHours()).padStart(2, "0");
    const minutes = String(istDate.getMinutes()).padStart(2, "0");
    const seconds = String(istDate.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const getMonthNameIST = (date) => {
    const istDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[istDate.getMonth()];
  };

  const getCurrentDateIST = () => {
    return new Date(
      currentDateTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) throw new Error("Failed to fetch todos");
      const data = await response.json();
      setTodos(
        data.length > 0
          ? data
          : scheduleData.map((item, index) => ({
              _id: `default-${index}`,
              activity: item.activity,
              time: item.time,
              category: item.category,
              completed: false,
              day: item.day,
              createdAt: new Date().toISOString(),
            }))
      );
    } catch (err) {
      console.error("Error fetching todos:", err);
      setError("Could not connect to backend. Using local data.");
      setTodos(
        scheduleData.map((item, index) => ({
          _id: `default-${index}`,
          activity: item.activity,
          time: item.time,
          category: item.category,
          completed: false,
          day: item.day,
          createdAt: new Date().toISOString(),
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  // Convert time string to minutes for sorting
  const parseTimeToMinutes = (timeStr) => {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return 0;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  // Sort todos by time
  const sortTodosByTime = (todosToSort) => {
    return [...todosToSort].sort((a, b) => {
      return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
    });
  };

  const downloadExcel = () => {
    let html = `
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
            th { background-color: #1e40af; color: white; padding: 12px; text-align: left; font-weight: bold; border: 1px solid #ddd; }
            td { padding: 12px; border: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f0f9ff; }
            tr:hover { background-color: #e0e7ff; }
            h1 { color: #1e40af; }
            h2 { color: #16a34a; }
          </style>
        </head>
        <body>
          <h1>📅 DAILY SCHEDULE: 5 AM TO 10 PM</h1>
          <p><strong>Total Study Hours:</strong> 6-7 hours focused learning</p>
          <p><strong>Generated:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
          <h2>Daily Tasks & Activities</h2>
          <table>
            <tr>
              <th>TIME</th>
              <th>ACTIVITY</th>
              <th>CATEGORY</th>
              <th>DAYS</th>
              <th>STATUS</th>
            </tr>
    `;

    scheduleData.forEach((item) => {
      html += `
        <tr>
          <td><strong>${item.time}</strong></td>
          <td>${item.activity}</td>
          <td>${item.category}</td>
          <td>${item.day === "all" ? "Every Day" : item.day}</td>
          <td>☐</td>
        </tr>
      `;
    });

    html += `
      </table>
      <h2>💡 Success Tips</h2>
      <p>✅ Consistency is key - Follow 90% of the time</p>
      <p>✅ Take breaks seriously - Rest helps learning</p>
      <p>✅ Build projects - Learning by doing is best</p>
      <p>✅ Network - Connect with developers/testers</p>
    </body>
    </html>
    `;

    const element = document.createElement("a");
    const file = new Blob([html], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });
    element.href = URL.createObjectURL(file);
    element.download = `Schedule_${new Date().getTime()}.xls`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const addTodo = async () => {
    if (!newTask.trim()) return;

    const todoData = {
      activity: newTask,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      category: "Custom",
      day: "all",
    };

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todoData),
      });

      if (!response.ok) throw new Error("Failed to add todo");
      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
      setNewTask("");
    } catch (err) {
      console.error("Error adding todo:", err);
      alert("Error adding task. Check console for details.");
    }
  };

  const toggleTodo = async (id, currentCompleted) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentCompleted }),
      });

      if (!response.ok) throw new Error("Failed to update todo");
      const updatedTodo = await response.json();
      setTodos(todos.map((t) => (t._id === id ? updatedTodo : t)));

      // Track daily completion
      const today = new Date().toISOString().split("T")[0];
      if (!currentCompleted) {
        // Task completed
        const totalTasks = todos.length;
        const completedCount =
          todos.filter((t) => (t._id === id ? !currentCompleted : t.completed))
            .length + 1;
        if (completedCount === totalTasks) {
          setCompletedDates((prev) => ({ ...prev, [today]: true }));
        }
      }
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete todo");
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  // Filter todos
  let filteredTodos = todos.filter((todo) => {
    let dayMatch = true;
    if (selectedDay !== "all") {
      dayMatch =
        todo.day === "all" ||
        todo.day
          .split(",")
          .map((d) => d.trim())
          .includes(selectedDay);
    }

    let categoryMatch = true;
    if (selectedCategory !== "all") {
      categoryMatch = todo.category === selectedCategory;
    }

    // Completion filter - based on showCompleted toggle
    let completionMatch = true;
    if (!showCompleted) {
      // Hide completed tasks (show only pending)
      completionMatch = !todo.completed;
    } else {
      // Show only completed tasks
      completionMatch = todo.completed;
    }

    return dayMatch && categoryMatch && completionMatch;
  });

  // SORT BY TIME - 5 AM to 10 PM
  filteredTodos = sortTodosByTime(filteredTodos);

  const completedCount = todos.filter((t) => t.completed).length;
  const completionPercentage =
    todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  const getCategoryColor = (category) => {
    const colors = {
      Health: { bg: "#fee2e2", text: "#991b1b", border: "#dc2626" },
      English: { bg: "#dbeafe", text: "#0c4a6e", border: "#0284c7" },
      Kannada: { bg: "#f3e8ff", text: "#581c87", border: "#a855f7" },
      HR: { bg: "#dcfce7", text: "#14532d", border: "#22c55e" },
      Break: { bg: "#fef3c7", text: "#713f12", border: "#f59e0b" },
      Learning: { bg: "#e0e7ff", text: "#312e81", border: "#6366f1" },
      Projects: { bg: "#fed7aa", text: "#7c2d12", border: "#f97316" },
      "Soft Skills": { bg: "#fbcfe8", text: "#831843", border: "#ec4899" },
      Revision: { bg: "#ccfbf1", text: "#134e4a", border: "#14b8a6" },
      Planning: { bg: "#cffafe", text: "#164e63", border: "#06b6d4" },
      Sleep: { bg: "#f3f4f6", text: "#374151", border: "#9ca3af" },
      Custom: { bg: "#f4f3d1", text: "#713f12", border: "#84cc16" },
    };
    return colors[category] || colors["Sleep"];
  };

  const days = ["all", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        paddingBottom: "2rem",
      }}
    >
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "1.5rem" }}>
        {error && (
          <div
            style={{
              backgroundColor: "#fef3c7",
              border: "2px solid #fbbf24",
              borderRadius: "0.75rem",
              padding: "1rem",
              marginBottom: "1.5rem",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "20px" }}>⚠️</span>
            <span style={{ color: "#b45309", fontWeight: "600" }}>{error}</span>
          </div>
        )}

        {/* Header */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #1e40af 100%)",
            borderRadius: "1rem",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "900",
                  color: "white",
                  marginBottom: "0.5rem",
                }}
              >
                📅 Professional Schedule Tracker
              </h1>
              <p
                style={{
                  color: "#e0e7ff",
                  fontSize: "1.125rem",
                  fontWeight: "500",
                }}
              >
                Master your 5 AM to 10 PM learning journey
              </p>
            </div>
            <button
              onClick={downloadExcel}
              style={{
                background: "white",
                color: "#1e40af",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
            >
              📥 Download Excel
            </button>
          </div>
        </div>

        {/* Stats */}
        {!loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              }}
            >
              <p
                style={{
                  color: "#bfdbfe",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginBottom: "0.25rem",
                }}
              >
                📊 Completion
              </p>
              <p
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "900",
                  color: "#dbeafe",
                }}
              >
                {completionPercentage}%
              </p>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #581c87 0%, #a855f7 100%)",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              }}
            >
              <p
                style={{
                  color: "#e9d5ff",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginBottom: "0.25rem",
                }}
              >
                ✅ Completed
              </p>
              <p
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "900",
                  color: "#f3e8ff",
                }}
              >
                {completedCount}/{todos.length}
              </p>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #831843 0%, #ec4899 100%)",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              }}
            >
              <p
                style={{
                  color: "#fbcfe8",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginBottom: "0.25rem",
                }}
              >
                📋 Total
              </p>
              <p
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "900",
                  color: "#fce7f3",
                }}
              >
                {filteredTodos.length}
              </p>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #164e63 0%, #06b6d4 100%)",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              }}
            >
              <p
                style={{
                  color: "#cffafe",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginBottom: "0.25rem",
                }}
              >
                ⏱️ Study
              </p>
              <p
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "900",
                  color: "#e0f2fe",
                }}
              >
                6-7h
              </p>
            </div>
          </div>
        )}

        {/* Monthly Progress Tracker */}
        {!loading && (
          <div
            style={{
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              marginBottom: "2rem",
              border: "1px solid rgba(148, 163, 184, 0.2)",
            }}
          >
            {/* Real-time Date & Time Display */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  border: "1px solid #3b82f6",
                }}
              >
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.75rem",
                    marginBottom: "0.25rem",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  📅 Date (IST)
                </p>
                <p
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    color: "#3b82f6",
                    marginBottom: "0.25rem",
                  }}
                >
                  {getDayNameIST(currentDateTime)}
                </p>
                <p style={{ fontSize: "0.875rem", color: "#cbd5e1" }}>
                  {formatDateIST(currentDateTime)}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  border: "1px solid #10b981",
                }}
              >
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.75rem",
                    marginBottom: "0.25rem",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  🕐 Time (IST)
                </p>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#10b981",
                    fontFamily: "monospace",
                    letterSpacing: "2px",
                  }}
                >
                  {formatTimeIST(currentDateTime)}
                </p>
              </div>
            </div>

            {/* Month Header */}
            <div style={{ marginBottom: "1rem", textAlign: "center" }}>
              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginBottom: "0.25rem",
                }}
              >
                {getMonthNameIST(currentDateTime)}{" "}
                {getCurrentDateIST().getFullYear()} - IST (Kolkata/New Delhi)
              </p>
              <p
                style={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}
              >
                🔥 Monthly Streak & Daily Progress
              </p>
            </div>

            {/* Monthly Calendar Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  style={{
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    padding: "0.5rem",
                  }}
                >
                  {day}
                </div>
              ))}

              {[...Array(31)].map((_, i) => {
                const istDate = getCurrentDateIST();
                const dateObj = new Date(
                  istDate.getFullYear(),
                  istDate.getMonth(),
                  i + 1
                );
                const dateStr = dateObj.toISOString().split("T")[0];
                const todayIST = istDate.toISOString().split("T")[0];
                const isCompleted = completedDates[dateStr];
                const isToday = dateStr === todayIST;

                if (
                  i + 1 >
                  new Date(
                    istDate.getFullYear(),
                    istDate.getMonth() + 1,
                    0
                  ).getDate()
                ) {
                  return null;
                }

                return (
                  <div
                    key={i + 1}
                    style={{
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                      border: isToday
                        ? "2px solid #fbbf24"
                        : "1px solid rgba(148, 163, 184, 0.3)",
                      background: isCompleted
                        ? "linear-gradient(135deg, #10b981, #059669)"
                        : isToday
                        ? "rgba(251, 191, 36, 0.2)"
                        : "rgba(148, 163, 184, 0.1)",
                      color: isCompleted
                        ? "white"
                        : isToday
                        ? "#fbbf24"
                        : "#cbd5e1",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      animation: isCompleted ? "pulse 0.6s ease-out" : "none",
                      boxShadow: isToday
                        ? "0 0 10px rgba(251, 191, 36, 0.5)"
                        : "none",
                    }}
                    title={
                      isToday
                        ? "Today - Saturday 02.11.2025"
                        : isCompleted
                        ? "Completed ✓"
                        : `Day ${i + 1}`
                    }
                  >
                    {isCompleted ? "🔥" : isToday ? "🎯" : i + 1}
                  </div>
                );
              })}
            </div>

            {/* Relay Race Animation Progress */}
            <div style={{ marginTop: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    color: "#cbd5e1",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  🏃 {getMonthNameIST(currentDateTime)} Relay Race
                </p>
                <p
                  style={{
                    color: "#10b981",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                  }}
                >
                  {Object.keys(completedDates).length}/31 Days Completed
                </p>
              </div>

              {/* Start & Finish Line */}
              <div style={{ position: "relative", marginBottom: "2rem" }}>
                {/* Track Background */}
                <div
                  style={{
                    width: "100%",
                    height: "80px",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    borderRadius: "0.5rem",
                    border: "2px solid #3b82f6",
                    position: "relative",
                    overflow: "hidden",
                    background:
                      "linear-gradient(180deg, rgba(59, 130, 246, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)",
                  }}
                >
                  {/* Start Line */}
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "0",
                      bottom: "0",
                      width: "2px",
                      background:
                        "repeating-linear-gradient(90deg, #fbbf24, #fbbf24 2px, transparent 2px, transparent 4px)",
                      zIndex: "10",
                    }}
                  ></div>

                  {/* Finish Line */}
                  <div
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "0",
                      bottom: "0",
                      width: "3px",
                      background:
                        "repeating-linear-gradient(90deg, #dc2626, #dc2626 3px, transparent 3px, transparent 6px)",
                      zIndex: "10",
                    }}
                  ></div>

                  {/* Runner 1 (Days 1-6) */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: `${Math.min(
                        (Object.keys(completedDates).length / 6) * 100,
                        100
                      )}%`,
                      fontSize: "2.5rem",
                      animation:
                        Object.keys(completedDates).length > 0 &&
                        Object.keys(completedDates).length <= 6
                          ? "bounce 0.6s ease-in-out infinite"
                          : "none",
                      transition: "left 0.8s ease-out",
                      zIndex:
                        Object.keys(completedDates).length <= 6 ? "20" : "5",
                      transform: "scaleX(-1)",
                    }}
                  >
                    🏃
                  </div>

                  {/* Runner 2 (Days 7-12) */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: `${Math.min(
                        ((Object.keys(completedDates).length - 6) / 6) * 100,
                        100
                      )}%`,
                      fontSize: "2.5rem",
                      animation:
                        Object.keys(completedDates).length > 6 &&
                        Object.keys(completedDates).length <= 12
                          ? "bounce 0.6s ease-in-out infinite"
                          : "none",
                      transition: "left 0.8s ease-out",
                      opacity: Object.keys(completedDates).length > 5 ? 1 : 0,
                      zIndex:
                        Object.keys(completedDates).length > 6 &&
                        Object.keys(completedDates).length <= 12
                          ? "20"
                          : "5",
                      transform: "scaleX(-1)",
                    }}
                  >
                    🏃‍♀️
                  </div>

                  {/* Runner 3 (Days 13-18) */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: `${Math.min(
                        ((Object.keys(completedDates).length - 12) / 6) * 100,
                        100
                      )}%`,
                      fontSize: "2.5rem",
                      animation:
                        Object.keys(completedDates).length > 12 &&
                        Object.keys(completedDates).length <= 18
                          ? "bounce 0.6s ease-in-out infinite"
                          : "none",
                      transition: "left 0.8s ease-out",
                      opacity: Object.keys(completedDates).length > 11 ? 1 : 0,
                      zIndex:
                        Object.keys(completedDates).length > 12 &&
                        Object.keys(completedDates).length <= 18
                          ? "20"
                          : "5",
                      transform: "scaleX(-1)",
                    }}
                  >
                    🏃🏽
                  </div>

                  {/* Runner 4 (Days 19-24) */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: `${Math.min(
                        ((Object.keys(completedDates).length - 18) / 6) * 100,
                        100
                      )}%`,
                      fontSize: "2.5rem",
                      animation:
                        Object.keys(completedDates).length > 18 &&
                        Object.keys(completedDates).length <= 24
                          ? "bounce 0.6s ease-in-out infinite"
                          : "none",
                      transition: "left 0.8s ease-out",
                      opacity: Object.keys(completedDates).length > 17 ? 1 : 0,
                      zIndex:
                        Object.keys(completedDates).length > 18 &&
                        Object.keys(completedDates).length <= 24
                          ? "20"
                          : "5",
                      transform: "scaleX(-1)",
                    }}
                  >
                    🏃‍♂️🏻
                  </div>

                  {/* Runner 5 (Days 25-31) */}
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: `${Math.min(
                        ((Object.keys(completedDates).length - 24) / 7) * 100,
                        100
                      )}%`,
                      fontSize: "2.5rem",
                      animation:
                        Object.keys(completedDates).length > 24
                          ? "bounce 0.6s ease-in-out infinite"
                          : "none",
                      transition: "left 0.8s ease-out",
                      opacity: Object.keys(completedDates).length > 23 ? 1 : 0,
                      zIndex:
                        Object.keys(completedDates).length > 24 ? "20" : "5",
                      transform: "scaleX(-1)",
                    }}
                  >
                    🏃‍♀️🏾
                  </div>

                  {/* Baton */}
                  <div
                    style={{
                      position: "absolute",
                      top: "45px",
                      left: `${
                        (Object.keys(completedDates).length / 31) * 100
                      }%`,
                      width: "4px",
                      height: "30px",
                      background: "linear-gradient(180deg, #f59e0b, #d97706)",
                      borderRadius: "2px",
                      transition: "left 0.8s ease-out",
                      boxShadow: "0 0 10px rgba(245, 158, 11, 0.8)",
                      zIndex: "15",
                    }}
                  ></div>

                  {/* Progress Percentage */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      color: "#fbbf24",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      textShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
                      zIndex: "25",
                    }}
                  >
                    {Math.round(
                      (Object.keys(completedDates).length / 31) * 100
                    )}
                    %
                  </div>
                </div>

                {/* Labels */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "0.5rem",
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                  }}
                >
                  <span>🏁 Start (Day 1)</span>
                  <span>🏆 Finish (Day 31)</span>
                </div>
              </div>

              {/* Runner Info */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "0.75rem",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      Object.keys(completedDates).length <= 6
                        ? "rgba(59, 130, 246, 0.3)"
                        : "rgba(148, 163, 184, 0.1)",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    textAlign: "center",
                    border:
                      Object.keys(completedDates).length <= 6
                        ? "2px solid #3b82f6"
                        : "1px solid rgba(148, 163, 184, 0.3)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Runner 1
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: "#3b82f6",
                    }}
                  >
                    Days 1-6
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor:
                      Object.keys(completedDates).length > 6 &&
                      Object.keys(completedDates).length <= 12
                        ? "rgba(59, 130, 246, 0.3)"
                        : "rgba(148, 163, 184, 0.1)",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    textAlign: "center",
                    border:
                      Object.keys(completedDates).length > 6 &&
                      Object.keys(completedDates).length <= 12
                        ? "2px solid #3b82f6"
                        : "1px solid rgba(148, 163, 184, 0.3)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Runner 2
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: "#7c3aed",
                    }}
                  >
                    Days 7-12
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor:
                      Object.keys(completedDates).length > 12 &&
                      Object.keys(completedDates).length <= 18
                        ? "rgba(59, 130, 246, 0.3)"
                        : "rgba(148, 163, 184, 0.1)",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    textAlign: "center",
                    border:
                      Object.keys(completedDates).length > 12 &&
                      Object.keys(completedDates).length <= 18
                        ? "2px solid #3b82f6"
                        : "1px solid rgba(148, 163, 184, 0.3)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Runner 3
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: "#ec4899",
                    }}
                  >
                    Days 13-18
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor:
                      Object.keys(completedDates).length > 18 &&
                      Object.keys(completedDates).length <= 24
                        ? "rgba(59, 130, 246, 0.3)"
                        : "rgba(148, 163, 184, 0.1)",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    textAlign: "center",
                    border:
                      Object.keys(completedDates).length > 18 &&
                      Object.keys(completedDates).length <= 24
                        ? "2px solid #3b82f6"
                        : "1px solid rgba(148, 163, 184, 0.3)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Runner 4
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: "#f59e0b",
                    }}
                  >
                    Days 19-24
                  </p>
                </div>
                <div
                  style={{
                    backgroundColor:
                      Object.keys(completedDates).length > 24
                        ? "rgba(59, 130, 246, 0.3)"
                        : "rgba(148, 163, 184, 0.1)",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    textAlign: "center",
                    border:
                      Object.keys(completedDates).length > 24
                        ? "2px solid #3b82f6"
                        : "1px solid rgba(148, 163, 184, 0.3)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Runner 5
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: "#10b981",
                    }}
                  >
                    Days 25-31
                  </p>
                </div>
              </div>
            </div>

            <style>{`
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
              }
            `}</style>

            {/* Streak Counter & Status */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1rem",
                marginTop: "1.5rem",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  border: "1px solid #ef4444",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.75rem",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  🔥 Streak
                </p>
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: "900",
                    color: "#ef4444",
                  }}
                >
                  {Object.keys(completedDates).length}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  border: "1px solid #22c55e",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.75rem",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  ✅ Done
                </p>
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: "900",
                    color: "#10b981",
                  }}
                >
                  {Object.keys(completedDates).length}/{31}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(251, 191, 36, 0.1)",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  border: "1px solid #fbbf24",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.75rem",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  📅 Date
                </p>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "900",
                    color: "#fbbf24",
                  }}
                >
                  02.11.2025
                </p>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
            }
          }
        `}</style>
        <div
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.8)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            marginBottom: "2rem",
            border: "1px solid rgba(148, 163, 184, 0.2)",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <p
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
              }}
            >
              🗓️ Day
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    fontWeight: "bold",
                    border: "none",
                    cursor: "pointer",
                    background:
                      selectedDay === day
                        ? "linear-gradient(135deg, #3b82f6, #7c3aed)"
                        : "#475569",
                    color: "white",
                    fontSize: "0.875rem",
                  }}
                >
                  {day === "all" ? "📅 All" : day}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <p
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
              }}
            >
              🏷️ Category
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button
                onClick={() => setSelectedCategory("all")}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  background:
                    selectedCategory === "all"
                      ? "linear-gradient(135deg, #3b82f6, #7c3aed)"
                      : "#475569",
                  color: "white",
                  fontSize: "0.875rem",
                }}
              >
                📋 All
              </button>
              {categories.map((cat) => {
                const colors = getCategoryColor(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      fontWeight: "bold",
                      border: `2px solid ${colors.border}`,
                      cursor: "pointer",
                      background:
                        selectedCategory === cat ? colors.bg : "transparent",
                      color:
                        selectedCategory === cat ? colors.text : colors.border,
                      fontSize: "0.875rem",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
              }}
            >
              ✓ Show Tasks
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => setShowCompleted(false)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  background: !showCompleted
                    ? "linear-gradient(135deg, #3b82f6, #7c3aed)"
                    : "#475569",
                  color: "white",
                  fontSize: "0.875rem",
                }}
              >
                📌 Pending Tasks
              </button>
              <button
                onClick={() => setShowCompleted(true)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  background: showCompleted ? "#10b981" : "#475569",
                  color: "white",
                  fontSize: "0.875rem",
                }}
              >
                ✅ Completed Tasks
              </button>
              <span
                style={{
                  color: "#94a3b8",
                  fontSize: "0.75rem",
                  marginLeft: "1rem",
                }}
              >
                {showCompleted
                  ? `📊 Showing ${filteredTodos.length} completed`
                  : `📊 Showing ${filteredTodos.length} pending`}
              </span>
            </div>
          </div>
        </div>

        {/* Add Task */}
        <div
          style={{
            backgroundColor: "rgba(30, 41, 59, 0.8)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            marginBottom: "2rem",
            border: "1px solid rgba(148, 163, 184, 0.2)",
          }}
        >
          <p
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: "0.875rem",
              marginBottom: "1rem",
              textTransform: "uppercase",
            }}
          >
            ➕ Add Task
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <input
              type="text"
              placeholder="Enter task name..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "0.5rem",
                backgroundColor: "#1e293b",
                border: "2px solid #475569",
                color: "white",
                fontSize: "1rem",
                fontWeight: "500",
              }}
            />
            <button
              onClick={addTodo}
              style={{
                background: "linear-gradient(135deg, #3b82f6, #7c3aed)",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.target.style.boxShadow =
                  "0 10px 15px -3px rgba(0, 0, 0, 0.3)")
              }
              onMouseOut={(e) => (e.target.style.boxShadow = "none")}
            >
              ➕ Add
            </button>
          </div>
        </div>

        {/* Tasks */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {loading ? (
            <p
              style={{
                color: "white",
                textAlign: "center",
                fontSize: "1.125rem",
              }}
            >
              Loading tasks...
            </p>
          ) : filteredTodos.length === 0 ? (
            <div
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.8)",
                borderRadius: "0.75rem",
                padding: "3rem",
                textAlign: "center",
                border: "1px solid rgba(148, 163, 184, 0.2)",
              }}
            >
              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "1.125rem",
                  fontWeight: "600",
                }}
              >
                🔍 No tasks found
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => {
              const colors = getCategoryColor(todo.category);
              return (
                <div
                  key={todo._id}
                  style={{
                    backgroundColor: "rgba(30, 41, 59, 0.8)",
                    borderRadius: "0.75rem",
                    padding: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "1rem",
                    border: `2px solid ${colors.border}`,
                    opacity: todo.completed ? 0.6 : 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ display: "flex", gap: "1rem", flex: 1 }}>
                    <button
                      onClick={() => toggleTodo(todo._id, todo.completed)}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "0.375rem",
                        border: `2px solid ${colors.border}`,
                        background: todo.completed ? colors.bg : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                        fontSize: "16px",
                        color: colors.text,
                        fontWeight: "bold",
                      }}
                    >
                      {todo.completed && "✓"}
                    </button>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: "bold",
                          color: todo.completed ? "#94a3b8" : "white",
                          textDecoration: todo.completed
                            ? "line-through"
                            : "none",
                          marginBottom: "0.75rem",
                        }}
                      >
                        {todo.activity}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            color: "#cbd5e1",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                          }}
                        >
                          🕐 {todo.time}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.35rem 0.75rem",
                            borderRadius: "9999px",
                            fontWeight: "bold",
                            backgroundColor: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          {todo.category}
                        </span>
                        {todo.day !== "all" && (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.35rem 0.75rem",
                              borderRadius: "9999px",
                              fontWeight: "bold",
                              backgroundColor: "#1e293b",
                              color: "#94a3b8",
                              border: "1px solid #475569",
                            }}
                          >
                            📅 {todo.day}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    style={{
                      backgroundColor: "#dc2626",
                      color: "white",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      border: "none",
                      cursor: "pointer",
                      flexShrink: 0,
                      fontSize: "16px",
                      fontWeight: "bold",
                      transition: "all 0.3s ease",
                    }}
                  >
                    🗑️
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "3rem",
            background: "linear-gradient(135deg, #1e3a8a, #6b21a8)",
            borderRadius: "0.75rem",
            padding: "2rem",
            textAlign: "center",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
          }}
        >
          <p
            style={{
              color: "#dbeafe",
              fontWeight: "700",
              fontSize: "1.125rem",
            }}
          >
            💪 Start your journey today! Wake up at 5 AM and crush your goals.
          </p>
          <p
            style={{
              color: "#bfdbfe",
              fontSize: "0.875rem",
              marginTop: "0.75rem",
              fontWeight: "500",
            }}
          >
            Consistent effort for 30 days will transform your career. You got
            this! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
