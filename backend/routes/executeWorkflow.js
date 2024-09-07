const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');
const { Workflow } = require("../models/workflowModel");
const { convertCsvToJson } = require('../utils/cvToJson');
const { sendPostRequest } = require('../utils');

const upload = multer({ dest: path.join(__dirname, '../uploads/') });

router.post("/:id/execute", upload.single("file"), async (req, res) => {
  try {
    const workflowId = req.params.id;
    const csvFile = req.file;

    if (!csvFile) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const results = [];
    fs.createReadStream(csvFile.path)
      .pipe(csvParser())
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        return res.status(500).json({ message: "Error processing CSV file." });
      })
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const workflow = await Workflow.findById(workflowId);
          if (!workflow) {
            return res.status(404).json({ message: "Workflow not found." });
          }

          let processedData = results;
          for (const node of workflow.nodes) {
            switch (node.type) {
              case 'filterData':
                processedData = processedData.map(row => {
                  for (const key in row) {
                    if (row.hasOwnProperty(key)) {
                      row[key] = row[key].toLowerCase();
                    }
                  }
                  return row;
                });
                break;
              case 'wait':
                await new Promise(resolve => setTimeout(resolve, 60000));
                break;
              case 'convertFormat':
                processedData = await convertCsvToJson(processedData);
                break;
              case 'sendPostRequest':
                await sendPostRequest(processedData);
                break;
              default:
                return res.status(400).json({ message: `Unknown node type: ${node.type}` });
            }
          }

          res.json({ message: "Workflow executed successfully.", data: processedData });
        } catch (error) {
          console.error("Error executing workflow:", error);
          res.status(500).json({ message: "Server error while executing workflow." });
        } finally {
          fs.unlink(csvFile.path, (err) => {
            if (err) console.error("Error deleting file:", err);
          });
        }
      });
  } catch (error) {
    console.error("Error executing workflow:", error);
    res.status(500).json({ message: "Server error while executing workflow." });
  }
});

module.exports = router;
