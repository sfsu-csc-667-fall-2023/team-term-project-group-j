// Register the handler for the "/join" route
router.post("/join", handler);

// Register the handler for the "/:id/join" route
router.post("/:id/join", handler);

// Export the router for use in other parts of the application
module.exports = router;