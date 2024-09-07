import React, { useState, useEffect } from "react";
import axios from 'axios';

function CallWorkflow() {
  const [csvFile, setCsvFile] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [workflowOptions, setWorkflowOptions] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await axios.get("http://localhost:4005/api/workflows");
        setWorkflowOptions(response.data); 
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to fetch workflows.");
      }
    };
  
    fetchWorkflows();
  }, []);


  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!csvFile) {
      setErrorMessage("Please upload a CSV file.");
      return;
    }
  
    if (!selectedWorkflow) {
      setErrorMessage("Please select a workflow.");
      return;
    }
  
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
  
    const formData = new FormData();
    formData.append("file", csvFile);
    formData.append("workflowId", selectedWorkflow);
  
    try {
      const response = await fetch(
        `http://localhost:4005/api/workflows/${selectedWorkflow}/execute`,
        {
          method: "POST",
          body: formData,
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      setSuccessMessage(result.message || "Workflow executed successfully!");
    } catch (error) {
      console.error("Error submitting workflow:", error); // Log to console
      setErrorMessage(error.message || "Failed to execute workflow.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="glass flex flex-col items-center rounded shadow-lg w-[90%] mx-auto">
      <div className="innerGlass flex items-center justify-center flex-col gap-5">
        <h2 className="text-lg text-gray-800 font-[500] mb-4">CALL WORKFLOW</h2>

        <div className="w-full flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Workflow
          </label>
          <select
            value={selectedWorkflow}
            onChange={(e) => setSelectedWorkflow(e.target.value)}
            className="p-2 border border-gray-300 rounded text-sm"
          >
            <option value="" disabled>
              Select a workflow
            </option>
            {workflowOptions.map((workflow) => (
              <option key={workflow._id} value={workflow._id}>
                {workflow.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full flex flex-col space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="p-2 border border-gray-300 rounded text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded mt-4"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {/* Render success or error messages */}
        {successMessage && (
          <div className="mt-4 p-2 bg-green-200 text-green-800 rounded">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 p-2 bg-red-200 text-red-800 rounded">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default CallWorkflow;
