import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useRouter } from "next/router";
import { AiOutlineDelete, AiOutlineClose } from "react-icons/ai";
import { FaFileLines, FaGoogleDrive } from "react-icons/fa6";
import {
  PiTrashDuotone,
  PiDownloadSimpleDuotone,
  PiQueueDuotone,
  PiFileTextBold,
  PiWarningDuotone,
} from "react-icons/pi";

import { CiMenuKebab } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import Spinner from "../../components/animation/spinner";
import useChatInfoStore from "../../stores/chatStore";
import withLayout from "../../components/layouts/withLayout";
import formatDate from "../../utils/dateFormat";
import UploadStatusChecker from "../../components/uploadStatusModal";

function UploadPage({ accessToken }) {
  const [filesUpload, setFilesUpload] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadIneQueue, setUploadIneQueue] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const fileInput = useRef(null);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [hoveredID, setHoveredID] = useState(null);
  const setSummarizeId = useChatInfoStore((state) => state.setSummarizeId);
  const [expandedSummarizeRow, setExpandedSummarizeRow] = useState(null);
  const [expandedMetadataRow, setExpandedMetadataRow] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  const router = useRouter();

  // const selectDocument = (fileId) => {
  //   setSelectedID(fileId)
  //   console.log("this is document selected " +selectedID )
  // }

  const handleMouseEnter = (id) => {
    setHoveredID(id);
  };
  const handleMouseLeave = () => {
    setHoveredID(null);
  };
  const downloadDocumentClick = (fileId) => {
    console.log("this is selected ID from click" + fileId);
    setSelectedID(fileId);
    getDownloadDocument(fileId);
  };

  async function summarizeDocumentClick(fileId, index) {
    setSummaryLoading(true);
    setExpandedSummarizeRow(index);
    setSelectedID(fileId);
    setSummarizeId(fileId);
    setSummaryData("");
    setExpandedSummarizeRow(expandedSummarizeRow === index ? null : index); // Toggle the expanded row

    if (expandedSummarizeRow !== index) {
      const data = await getSummary(fileId);
      setSummaryData(data);
    }
    setSummaryLoading(false);
  }

  async function metadataClick(fileId, index) {
    setExpandedMetadataRow(index);
    // setSelectedID(fileId);
    // setSummarizeId(fileId);
    setExpandedMetadataRow(expandedMetadataRow === index ? null : index); // Toggle the expanded row
  }

  const getSummary = async (id) => {
    const selectedId = id;

    try {
      const response = await axios.post(
        `/api/chatbot/getSummary`,
        { selectedId: selectedId },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const summary = await response.data.message;
      console.log("this is summary ", summary);
      return summary;
    } catch (err) {
      console.log(err);
      return "Failed";
    }
  };

  const deleteDocumentClick = (fileId) => {
    setSelectedID(fileId);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    console.log("here is from props: " + accessToken);
    if (accessToken) {
      fetchUploadedDocuments(accessToken);
    }
  }, [accessToken]);

  async function handleFileChoose() {
    fileInput.current.click();
  }

  function handleFileChange(event) {
    setFilesUpload([...event.target.files]);
    console.log("this is files" + filesUpload.name);
    handleFilesUpload([...event.target.files]);
    setShowPopup(true);
    setShowUploadDropdown(null);
    event.target.value = null;
  }

  async function handleCheckStatus(inqueue) {
    console.log("handleCheckStatus " + inqueue);
    const interval = setInterval(async () => {
      console.log("this is interval " + inqueue);
      // const response = await axios.post(
      //   "/api/upload/postFileUploadStatus",
      //   { file_id: inqueue },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      console.log("this is response from check status", response.data);
      // if (response.data.upload_status === "completed") {
      //   clearInterval(interval);
      //   fetchUploadedDocuments(accessToken);
      // }
    }, 1000);
  }

  async function handleFilesUpload(files) {
    setUploadStatus("in-progress");
    console.log("handleFilesUpload " + filesUpload);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        "https://chitchatrabbit.me/uploadfiles",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("this is upload", response.data);
      setUploadIneQueue(response.data);
      // handleCheckStatus(response.data);
      console.log("upload completed");
      fetchUploadedDocuments(accessToken);
    } catch (error) {
      console.error("Error uploading:", error);
      setUploadStatus("failed");
      const errorMessage = "Failed to upload";
      window.alert(error);
      fetchUploadedDocuments(accessToken);
    }
  }

  async function fetchUploadedDocuments(token) {
    console.log("Get documentList");
    console.log("this is accessToken from parameter" + token);
    const response = await axios.get("/api/upload/getDocumentsList", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      setDocumentList(response.data.response);
    } else {
      console.log("failed to fetch");
    }
  }

  async function getDownloadDocument(id) {
    if (!id) return;

    console.log("this is download document id" + id);
    try {
      const response = await axios.post(
        `/api/upload/getDownloadDocument`,
        { selectedId: id },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer", // Ensure the response type is arraybuffer
        }
      );
      // Convert the arraybuffer to a blob with the appropriate content type
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const blobURL = URL.createObjectURL(blob);

      // Open the blob URL in a new tab
      window.open(blobURL, "_blank");

      if (response.status === 200) {
        console.log("Document Opened");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  async function deleteDocument() {
    if (!selectedID) return;
    setDeleteStatus("in-progress");
    console.log("this is delete document id" + selectedID);
    try {
      const response = await axios.post(
        `/api/upload/getDeleteDocument`,
        { selectedId: selectedID },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("this is response ", response.data);

      if (response.status === 200) {
        console.log("Deleted document");
        setDeleteStatus("complete");
        fetchUploadedDocuments(accessToken);
        setDeleteModalOpen(false);
      } else {
        setDeleteStatus("complete");
        fetchUploadedDocuments(accessToken);
        setDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error during document deletion:", error);
      setDeleteStatus("complete");
      fetchUploadedDocuments(accessToken);
      setDeleteModalOpen(false);
      alert("Failed to Delete File.");
    }
  }
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log("this is search : ", value);
    if (typingTimeout) clearTimeout(typingTimeout);

    if (value.trim() !== "") {
      // Check if the value is not empty
      setTypingTimeout(
        setTimeout(() => {
          postSearchDocument(value);
        }, 1000) // 300ms delay
      );
    } else {
      fetchUploadedDocuments(sessionStorage.getItem("accessToken"));
    }
  };

  async function postSearchDocument(search_query) {
    const response = await axios.post(
      "/api/upload/postSearchByLabel",
      { search_query: search_query },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      console.log("this is response from search : ", response.data);
      setDocumentList(response.data);
    } else {
      setDocumentList(response.data);
    }
  }

  function StatusIndication({ fileStatus }) {
    return (
      <div>
        {fileStatus === "uploading" ? (
          <button className="relative transform transition-transform hover:scale-105 active:scale-95 px-2">
            <div className="relative group text-xs bg-orange-500 px-2 py-1 rounded-lg text-white">
              In-progress
            </div>
          </button>
        ) : fileStatus === "completed" ? (
          <button className="relative transform transition-transform hover:scale-105 active:scale-95 px-2">
            <div className="relative group text-xs bg-green-500 px-2 py-1 rounded-lg text-white">
              Completed
            </div>
          </button>
        ) : (
          <button className="relative transform transition-transform hover:scale-105 active:scale-95 px-2">
            <div className="relative group text-xs bg-red-500 px-2 py-1 rounded-lg text-white">
              Error
            </div>
          </button>
        )}
      </div>
    );
  }

  async function checkUploadStatus() {}

  return (
    <div className="">
      <div className="bg-white ">
        <div className="border-b">
          <div className="text-3xl text-gray-800 font-bold pl-10 pt-5">
            Your content{" "}
          </div>
          <div className="pl-10 pt-2 mb-5 text-gray-500 text-regular">
            Once a document is uploaded, the chatbot can access and reference
            its content during conversations, ensuring a more personalized and
            knowledgeable response system. It supports formats such as .pdf,
            .png, and .html.
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          <div className="relative mb-2 md:mb-0 flex">
            <div className="grid grid-cols-2 gap-6 p-6">
              <button
                className="p-4 ring-1 ring-gray-200 rounded-2xl text-left space-y-3 hover:ring-gray-300 active:ring-gray-400 min-w-fit"
                onClick={handleFileChoose}
              >
                <div className="flex items-center space-x-3">
                  <FaFileLines className="w-4 h-4 text-blue-800" />
                  <div className="text-indigo-700 text-base font-semibold">
                    + Upload document
                  </div>
                </div>
                <div>
                  Upload your files from local device (.pdf, .png, .html)
                </div>
                <input
                  type="file"
                  ref={fileInput}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  multiple
                ></input>
              </button>
              <button className="p-4 ring-1 ring-gray-200 rounded-2xl text-left space-y-3 hover:ring-gray-300 active:ring-gray-400">
                <div className="flex items-center space-x-3">
                  <FaGoogleDrive className="w-4 h-4 text-red-800" />
                  <div className="text-red-700 text-base font-semibold">
                    + Google drive
                  </div>
                </div>
                <div>Get your files securely from Google drive</div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
      <div className="bg-white p-5">
        <div>
          <div className="w-full md:w-1/3 relative mt-2 mb-3 md:mt-0 ">
            {/* Input Field */}
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="border rounded-md w-full pl-10 pr-4 py-2 focus:border-blue-400 focus:outline-none"
              placeholder="Search content"
            />

            {/* Absolute-positioned icon */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <FaSearch />
            </div>
          </div>
          <div className="outline outline-1 outline-gray-200 rounded-lg w-full">
            <div className="w-full space-y-1"></div>
            <table className="min-w-full divide-y divide-gray-200 border rounded-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 p-3.5"></th>
                  <th className="w-12 px-3.5 py-3.5"></th>
                  <th className="text-left text-xs font-semibold text-gray-700 uppercase">
                    Filename
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-700 uppercase">
                    Created Date
                  </th>
                  <th className=" text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className=" text-xs font-semibold text-gray-700 uppercase">
                    MetaData
                  </th>
                  <th className=" text-xs font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documentList &&
                  documentList.map((item, index) => (
                    <>
                      <tr
                        key={index}
                        className="hover:bg-gray-100"
                        onMouseEnter={() => handleMouseEnter(item.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <td className="">
                          <label className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-blue-600"
                            />
                          </label>
                        </td>
                        <td className="items-center justify-center">
                          {deleteStatus === "in-progress" &&
                          selectedID === item.id ? (
                            <Spinner
                              className="mr-5"
                              size={`w-5 h-5`}
                              tintColor={"fill-red-600"}
                              bgColor={"dark:text-gray-200"}
                            />
                          ) : (
                            <div className="text-sm ">
                              <PiFileTextBold />
                            </div>
                          )}
                        </td>
                        <td
                          className="whitespace-nowrap pr-3 py-4 text-sm text-gray-700 truncate text-ellipsis max-w-[10rem]"
                          onClick={() => {
                            downloadDocumentClick(item.id);
                          }}
                        >
                          {item.file_name}
                        </td>
                        <td className="whitespace-nowrap pr-3 py-4 text-sm text-gray-700 truncate text-ellipsis max-w-[10rem]">
                          {formatDate(item.upload_time)}
                        </td>
                        <td className="whitespace-nowrap text-center py-4 text-sm text-gray-700 truncate text-ellipsis max-w-[10rem]">
                          <StatusIndication fileStatus={item.status} />
                        </td>
                        <td className="relative whitespace-nowrap py-4 text-sm text-gray-700 max-w-[10rem] text-center">
                          {item.labels.length === 0 ? (
                            <div>-</div>
                          ) : (
                            <button
                              className="relative transform transition-transform hover:scale-105 active:scale-95 px-2"
                              onClick={() => {
                                metadataClick(item.id, index);
                              }}
                            >
                              <div className="relative group text-xs bg-cyan-500 px-2 py-1 rounded-lg text-white">
                                {item.labels[0]}
                              </div>
                            </button>
                          )}
                        </td>

                        <td className="py-3 flex justify-center items-center">
                          <button
                            onClick={() => {
                              downloadDocumentClick(item.id);
                            }}
                            className="relative transform transition-transform hover:scale-105 active:scale-95 px-2"
                          >
                            <div className="relative group">
                              <PiDownloadSimpleDuotone />

                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                Download
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              summarizeDocumentClick(item.id, index);
                            }}
                            className="px-2"
                          >
                            <div className="relative group">
                              <PiQueueDuotone />

                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                Summarize
                              </div>
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              deleteDocumentClick(item.id);
                            }}
                            className="px-2"
                          >
                            <div className="relative group">
                              <PiTrashDuotone />

                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                Delete
                              </div>
                            </div>

                            <Modal
                              className="modal"
                              isOpen={deleteModalOpen && selectedID == item.id}
                              onRequestClose={() => setDeleteModalOpen(false)}
                              overlayClassName="modal-overlay"
                            >
                              <h2 className="text-lg font-bold">
                                Are you sure you want to delete the file?
                              </h2>
                              <p className="text-xs mt-5">
                                Are you sure you want to delete{" "}
                                <strong>{" " + item.file_name}</strong> ?
                              </p>
                              <div className="flex justify-end mt-5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteModalOpen(false);
                                  }}
                                  className="bg-gray-100 text-black px-4 py-2 rounded mr-2"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={deleteDocument}
                                  className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                  {deleteStatus === "completed" ? (
                                    "Completed"
                                  ) : deleteStatus === "in-progress" ? (
                                    <div className="flex items-center justify-center">
                                      <Spinner
                                        className=""
                                        size={`w-5 h-5`}
                                        tintColor={"fill-white"}
                                        bgColor={"dark:text-red-500"}
                                      />{" "}
                                      <div className="ml-1">Deleting</div>{" "}
                                    </div>
                                  ) : (
                                    "Delete"
                                  )}
                                </button>
                              </div>
                            </Modal>
                          </button>
                        </td>
                      </tr>
                      {expandedSummarizeRow === index && (
                        <tr>
                          <td colSpan={6} className="p-4">
                            {summaryLoading ? (
                              <Spinner
                                className="mr-5"
                                size={`w-5 h-5`}
                                tintColor={"fill-cyan-600"}
                                bgColor={"dark:text-gray-200"}
                              />
                            ) : (
                              <>
                                <div className="text-sm font-bold">Summary</div>
                                <div className={`scaleUp text-sm`}>
                                  {summaryData}
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      )}
                      {expandedMetadataRow === index && (
                        <tr>
                          <td colSpan={6} className="p-4">
                          <div className="text-sm font-bold mb-2">MetaData</div>
                            <div>
                              {item.labels.map((label, index) => (
                                <button key= {index} className="relative transform transition-transform px-2 mb-2">
                                  <div className="relative group text-xs bg-cyan-500 px-2 py-1 rounded-lg text-white">
                                    {label}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="text-lg font-bold p-2 ">
            {/* {documentList.length || 0} Files Found */}
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="fixed bottom-4 right-4 w-2/3 lg:w-1/4 p-4 bg-white border rounded-lg shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowPopup(false)}
              className="bg-red-500 text-white rounded p-2 hover:bg-red-600"
            >
              <AiOutlineClose />
            </button>
          </div>
          <div>
            <UploadStatusChecker jsonData={uploadIneQueue} />
          </div>
        </div>
      )}
    </div>
  );
}

export default withLayout(UploadPage, "dashboard");
