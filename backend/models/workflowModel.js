const mongoose = require("mongoose");

// Node schema (embedded inside Workflow)
const nodeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["filterData", "convertFormat", "wait", "sendPostRequest"],
    },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    data: {
      label: { type: String, required: true },
      additionalInfo: { type: String },
    },
  },
  { _id: false }
);

// Edge schema (embedded inside Workflow)
const edgeSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    target: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["dependency", "relation", "default"],
    },
  },
  { _id: false }
);

// Workflow schema
const workflowSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nodes: [nodeSchema],
    edges: [edgeSchema],
  },
  { timestamps: true }
);

workflowSchema.index({ name: 1 });

module.exports = mongoose.model("Workflow", workflowSchema);
