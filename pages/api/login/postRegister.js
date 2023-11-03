import axios from "axios";

export default async function handler(req, res) {
  const { username, password } = req.body;

  const bodyRequest = {
    username: username,
    password: password,
  };

  const header = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(
      "https://chitchatrabbit.me/register",
      bodyRequest,
      {
        headers: header,
      }
    );

    res.status(200).json({
      success: true,
      message: "Moved to verification page",
    });
  } catch (error) {
    const statusCode = error.response ? error.response.status : 500;
    const message = error.response?.data?.detail || "An unexpected error occurred. Please try again later.";
    res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
}

// const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       setMessage("Passwords don't match");
//       return;
//     }

//     try {
//       const response = await fetch("https://chitchatrabbit.me/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           password: formData.password,
//         }),
//       });

//       // Assuming a successful response means the user has been registered
//       setMessage("Registered successfully!");

//       // You can return or process the response if needed
//       return response.data;
//     } catch (error) {
//       console.error("Error registering user:", error);

//       // If there's an error message in the response, use that, otherwise use a generic error message
//       const errorMessage =
//         error.response && error.response.data && error.response.data.message
//           ? error.response.data.message
//           : "An error occurred during registration.";

//       setMessage(errorMessage);
//     }
//   };
