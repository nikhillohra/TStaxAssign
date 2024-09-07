const axios = require('axios');

const sendPostRequest = async (data) => {
  try {
    const response = await axios.post('http://localhost:4005/api/workflowExecution', data);
    console.log('POST request successful:', response.data);
  } catch (error) {
    console.error('Error sending POST request:', error);
    throw error; 
  }
};

module.exports = sendPostRequest;
