const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const csvParser = require("csv-parser");
const Workflow = require("../models/workflowModel");
const { convertCsvToJson } = require("../utils/csvToJson");
const sendPostRequest = require("../utils/sendPostRequest");

// Multer file uploads
const upload = multer({ dest: path.join(__dirname, "../uploads/") });

// Fetch all workflows
router.get("/", async (req, res) => {
  try {
    const workflows = await Workflow.find();
    if (!workflows.length) {
      return res.status(404).json({ message: "No workflows found" });
    }
    res.json(workflows);
  } catch (err) {
    console.error("Error fetching workflows:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to execute a specific workflow with CSV file
router.post("/:id/execute", upload.single("file"), async (req, res) => {
  try {
    const workflowId = req.params.id;
    const csvFile = req.file;

    if (!csvFile) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Read and parse the CSV file
    const results = [];
    fs.createReadStream(csvFile.path)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        // Remove the uploaded file after processing
        fs.unlink(csvFile.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });

        // Find the workflow
        const workflow = await Workflow.findById(workflowId);
        if (!workflow) {
          return res.status(404).json({ message: "Workflow not found." });
        }

        // Process CSV data according to the workflow
        let processedData = results;
        for (const node of workflow.nodes) {
          switch (node.type) {
            case "filterData":
              processedData = processedData.map((row) => {
                for (const key in row) {
                  if (row.hasOwnProperty(key)) {
                    row[key] = row[key].toLowerCase();
                  }
                }
                return row;
              });
              break;
            case "wait":
              await new Promise((resolve) => setTimeout(resolve, 60000)); // Delay for 60 seconds
              break;
            case "convertFormat":
              processedData = await convertCsvToJson(csvFile.path); // Convert CSV file to JSON
              break;
            case "sendPostRequest":
              await sendPostRequest(processedData); // Ensure sendPostRequest is properly defined
              break;
            default:
              return res
                .status(400)
                .json({ message: `Unknown node type: ${node.type}` });
          }
        }

        res.json({
          message: "Workflow executed successfully.",
          data: processedData,
        });
      });
  } catch (error) {
    console.error("Error executing workflow:", error);
    res.status(500).json({ message: "Server error while executing workflow." });
  }
});

// Route to handle POST request to /api/workflowExecution
router.post('/workflowExecution', async (req, res) => {
  try {
    const data = req.body;

    // Process the data (e.g., store in database, trigger other actions, etc.)
    console.log('Data received:', data);

    // Respond to the request
    res.json({ message: 'Data received and processed successfully', receivedData: data });
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ message: 'Error processing data' });
  }
});


// Route to save workflow
router.post("/", async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;

    if (!name || !Array.isArray(nodes) || !Array.isArray(edges)) {
      return res.status(400).json({ message: "Invalid workflow structure" });
    }

    const workflow = new Workflow({ name, nodes, edges });
    await workflow.save();

    res
      .status(201)
      .json({ id: workflow._id, message: "Workflow saved successfully" });
  } catch (error) {
    console.error("Error saving workflow:", error);
    res.status(500).json({ message: "Server error while saving workflow." });
  }
});

module.exports = router;
