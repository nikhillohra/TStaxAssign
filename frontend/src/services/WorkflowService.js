// workflowService.js
import axios from 'axios';

// Use environment variable for backend URL
const API_URL = import.meta.env.VITE_BACKEND_URL + 'api/workflows';
console.log("API_URL:", API_URL);

// Fetch all workflows
export const getWorkflows = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching workflows:", error);
    throw new Error("Failed to fetch workflows");
  }
};

// Create a new workflow
export const createWorkflow = async (workflow) => {
  try {
    const response = await axios.post('https://t-stax-assign.vercel.app/api/workflows', workflow);
    return response.data;
  } catch (error) {
    console.error('Error creating workflow:', error);
    throw error;
  }
};

// Execute a workflow
export const executeWorkflow = async (workflowId, formData) => {
  try {
    const response = await axios.post(`${API_URL}/${workflowId}/execute`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure proper content type for file upload
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error executing workflow:", error);
    throw new Error("Failed to execute workflow");
  }
};
