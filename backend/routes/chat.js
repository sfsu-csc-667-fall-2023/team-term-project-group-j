const express = require("express");
const router = express.Router();
const { createHash } = require("crypto");

// Define a handler function to handle both routes
const handler = (request, response) => {

  try {
    // Extract parameters and session information from the request
    const { id } = request.params;
    const { message } = request.body;
    const { email } = request.session.user;

    // Access the Socket.IO instance from the app's settings
    const io = request.app.get("io");

    // Validate that the 'message' field is present
    if (!message) {
      throw new Error("Message is missing in the request body");
    }

    // Emit a "chat:message:0" event to all connected clients
    io.emit(`chat:message:0`, {
      hash: createHash("sha256").update(email).digest("hex"),
      from: email,
      timestamp: Date.now(),
      message,
    });

    // Respond with a 200 OK status
    response.status(200).send();
  } catch (error) {
    // Handle errors and send an appropriate response
    console.error("Error:", error.message);
    response.status(500).send("Internal Server Error");
  }
};

// Register the handler for the "/chat" route
router.post("/chat", handler);

// Register the handler for the "/:id/chat" route
router.post("/:id/chat", handler);

// Export the router for use in other parts of the application
module.exports = router;