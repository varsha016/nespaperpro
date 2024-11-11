// const PdfDetails = require("../model/PdfDetails");
// const fs = require("fs");
// const path = require("path");

// // Upload file controller
// const uploadFile = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ status: "error", message: "No file uploaded" });
//     }

//     const { title } = req.body;
//     const fileName = req.file.filename;

//     // Check if the PDF already exists in the database
//     const existingFile = await PdfDetails.findOne({ title });

//     if (existingFile) {
//       // If a file with the same title exists, delete the old file from the server
//       const oldFilePath = path.join(__dirname, '..', 'uploads', existingFile.pdf); // Adjust this to your file path
//       if (fs.existsSync(oldFilePath)) {
//         fs.unlinkSync(oldFilePath); // Delete the old file
//       }

//       // Update the existing record with the new file
//       existingFile.pdf = fileName; // Update with new file name
//       await existingFile.save(); // Save the updated file record
//     } else {
//       // If no file with the same title exists, create a new record
//       const pdfDetails = { title, pdf: fileName };
//       await PdfDetails.create(pdfDetails);
//     }

//     res.json({ status: "ok", message: "Uploaded Successfully" });
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
//   }
// };


// // Get files controller
// // const path = require("path");
// // const PdfDetails = require("../model/PdfDetails");

// const getFiles = async (req, res) => {
//   try {
//     const pdfData = await PdfDetails.findOne().sort({ _id: -1 }); // Sort to get the latest uploaded PDF
//     if (pdfData) {
//       // Construct the URL based on your server setup
//       const fileUrl = `${req.protocol}://${req.get("host")}/files/${pdfData.pdf}`;
//       res.json({ pdfUrl: fileUrl, title: pdfData.title });
//     } else {
//       res.status(404).json({ message: "No PDF found" });
//     }
//   } catch (error) {
//     console.error("Error fetching PDF:", error);
//     res.status(500).json({ message: "Error fetching PDF" });
//   }
// };





// module.exports = {
//   uploadFile,
//   getFiles,
// };

const PdfDetails = require("../model/PdfDetails");
const fs = require("fs");
const path = require("path");

// Upload file controller
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: "error", message: "No file uploaded" });
    }

    const { title } = req.body;
    const fileName = req.file.filename;

    // Check if the PDF already exists in the database
    const existingFile = await PdfDetails.findOne({ title });

    if (existingFile) {
      // If a file with the same title exists, delete the old file from the server
      const oldFilePath = path.join(__dirname, '..', 'files', existingFile.pdf); // Adjust this to your file path
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); // Delete the old file
      }

      // Update the existing record with the new file
      existingFile.pdf = fileName; // Update with new file name
      await existingFile.save(); // Save the updated file record
    } else {
      // If no file with the same title exists, create a new record
      const pdfDetails = { title, pdf: fileName };
      await PdfDetails.create(pdfDetails);
    }

    res.json({
      status: "ok",
      message: "Uploaded Successfully",
      fileUrl: `/files/${fileName}`, // Return the URL of the file
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ status: "error", message: error.message || "Internal Server Error" });
  }
};

// Get files controller
const getFiles = async (req, res) => {
  try {
    const pdfData = await PdfDetails.findOne().sort({ _id: -1 }); // Sort to get the latest uploaded PDF
    if (pdfData) {
      // Construct the URL based on your server setup
      const fileUrl = `${req.protocol}://${req.get("host")}/files/${pdfData.pdf}`;
      res.json({ pdfUrl: fileUrl, title: pdfData.title });
    } else {
      res.status(404).json({ message: "No PDF found" });
    }
  } catch (error) {
    console.error("Error fetching PDF:", error);
    res.status(500).json({ message: "Error fetching PDF" });
  }
};

module.exports = {
  uploadFile,
  getFiles,
};

