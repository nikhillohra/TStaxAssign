const Workflow = require("../models/workflowModel");
const fs = require("fs");
const { convertCsvToJson } = require("../utils/csvToJson");
const { delay } = require("../utils/delay");

//Save Workflow
exports.saveWorkflow = async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;
    if (!name || !Array.isArray(nodes) || !Array.isArray(edges)) {
      return res.status(400).json({ message: "Invalid workflow structure" });
    }

    const workflow = new Workflow({ name, nodes, edges });
    const savedWorkflow = await workflow.save();
    res.status(201).json({
      message: "Workflow saved successfully",
      workflow: savedWorkflow,
    });
  } catch (error) {
    console.error("Error saving workflow:", error);
    res
      .status(500)
      .json({ message: "Failed to save workflow", error: error.message });
  }
};

//Execute Workflow
exports.executeWorkflow = async (req, res) => {
  const { workflowId } = req.params;
  const csvFile = req.file;

  if (!csvFile) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const workflow = await Workflow.findById(workflowId);
    if (!workflow)
      return res.status(404).json({ message: "Workflow not found" });

    let data = await convertCsvToJson(csvFile.path);

    for (const node of workflow.nodes) {
      switch (node.type) {
        case "filterData":
          data = data.map((row) => {
            for (const key in row) {
              if (row.hasOwnProperty(key)) {
                row[key] = row[key].toLowerCase();
              }
            }
            return row;
          });
          break;
        case "convertFormat":
          data = await convertCsvToJson(data);
          break;
        case "wait":
          await delay(60000);
          break;
        case "sendPostRequest":
          await sendPostRequest(data);
          break;
        default:
          console.error(`Unknown node type: ${node.type}`);
          return res
            .status(400)
            .json({ message: `Unknown node type: ${node.type}` });
      }
    }

    res.status(200).json({ message: "Workflow executed successfully", data });
  } catch (error) {
    console.error("Workflow execution failed:", error);
    res
      .status(500)
      .json({ message: "Workflow execution failed", error: error.message });
  } finally {
    fs.promises
      .unlink(csvFile.path)
      .catch((err) => console.error("Error deleting file:", err));
  }
};
