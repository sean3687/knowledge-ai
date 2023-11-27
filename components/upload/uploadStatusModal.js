import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadStatusChecker = ({ jsonData }) => {
  console.log("here is inequeue",jsonData)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fileStatuses, setFileStatuses] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const checkUploadStatus = async (fileId) => {
    try {
      const response = await axios.post(
        "/api/upload/postFileUploadStatus",
        { fileId: fileId },
        {
          headers: {
            Authorization: `Bearer ${
              sessionStorage.getItem("accessToken") || ""
            }`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("api test, from client api",response.data.upload_status)
      return response.data.upload_status;
    } catch (error) {
      console.error("Error fetching upload status:", error);
      return "error";
    }
  };

  useEffect(() => {
    const inqueueData = jsonData;
    
    console.log("here is inequedata", jsonData)
    const startChecking = async () => {
      if (currentIndex < inqueueData.length) {
        const currentFile = inqueueData[currentIndex];
        const status = await checkUploadStatus(currentFile.file_id);

        let displayStatus = status;
        if (status === "completed") displayStatus = "Completed";
        else if (status === "error") displayStatus = "Error";
        else displayStatus = "In-queue";

        setFileStatuses((prevStatuses) => [
          ...prevStatuses,
          { fileName: currentFile.file_name, status: displayStatus },
        ]);

        if (status === "completed" || status === "error") {
          setCurrentIndex((prevIndex) => prevIndex + 1);
        } else {
          setTimeout(() => setCurrentIndex((prevIndex) => prevIndex + 1), 5000);
        }
      } else {
        
      }
    };

    startChecking();
  }, [currentIndex]);

  return (
    <div>
      <h2>
        {isCompleted
          ? "Complete uploading for file list"
          : "Uploading Files..."}
      </h2>
      <ul>
        {fileStatuses.map((fileStatus, index) => (
          <li key={index}>
            File name: {fileStatus.fileName}, upload status: {fileStatus.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadStatusChecker;
