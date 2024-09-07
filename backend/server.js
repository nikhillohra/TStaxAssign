const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");

// Load ENV
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Simple route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});


const workflowRoutes = require("./routes/workflows");
app.use("/api/workflows", workflowRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err); // Log the error
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// Start the server
const PORT = process.env.PORT || 4005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
