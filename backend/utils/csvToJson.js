const csvtojson = require("csvtojson");
const fs = require("fs");

const convertCsvToJson = async (filePath) => {
  try {
    const jsonArray = await csvtojson().fromFile(filePath);
    return jsonArray;
  } catch (error) {
    console.error("Error converting CSV to JSON:", error);
    throw error;
  }
};

module.exports = { convertCsvToJson };
