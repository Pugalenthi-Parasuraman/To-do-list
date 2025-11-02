const mongoose = require("mongoose");
require("dotenv").config();

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

// Schedule Data for Seeding
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

// Seeding Function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully!");

    // Check if data already exists
    const existingCount = await Todo.countDocuments();

    if (existingCount > 0) {
      console.log(`📊 Database already has ${existingCount} tasks.`);
      console.log("🗑️  Clearing old data...");
      await Todo.deleteMany({});
      console.log("✅ Old data cleared!");
    }

    // Insert seed data
    await Todo.insertMany(scheduleData);
    console.log(
      `✅ Successfully seeded ${scheduleData.length} tasks to database!`
    );
    console.log("📋 Tasks added:");
    scheduleData.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.activity} (${item.time})`);
    });

    // Disconnect from database
    await mongoose.disconnect();
    console.log("✅ Database seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
