import axios from "axios";

export default async function handler(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    console.log("this is token "+token)
    const {selectedId}  = req.body
    console.log("this is selected id " + selectedId)
    try {
        const response = await axios.get(`https://chitchatrabbit.me/delete_file/${selectedId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("can you see the documnent output?" + response.data)
        res.status(200).json({
            success: true,
            message: "Document List loaded",
            response: response.data

        });
    } catch (error) {
        const errorMessage = 
            error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : "Not authenticated";
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
}

// async function deleteDocument() {
//     try {
//       const response = await axios.get(
//         `https://chitchatrabbit.me/delete_file/${fileIdSelected}`,
//         {
//           headers: {
//             Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("this is response ", response.data);

//       if (response.status === 200) {
//         console.log("Deleted document");

//         // // Show the popup with the success message
//         // setPopupMessage("Successfully deleted!");
//         // setShowPopup(true);

//         // // Set a timeout to hide the popup after 3 seconds
//         // setTimeout(() => {
//         //   setShowPopup(false);
//         // }, 3000);
//         getDocumentsList();
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//     setIsDeleteModalOpen(false);
//   }