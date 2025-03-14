const resources = {
  errors: {
    error: "Error: ",
    unknown: "Unknown error",
    internalServerError: "Internal Server Error",
    validation: {
      validationError: "Validation error",
    },
    auth: {
      userExist: "User with this email already exists",
      userBlocked: "Your account has been blocked",
      failedJWT: "Failed to create JWT token",
      invalidCredentials: "Invalid credentials!",
      unauthorized: "Unauthorized",
      invalidToken: "Invalid token",
      userNotFound: "User not found",
    },
  },
  messages: {
    server: {
      serverWorks: "Server is up and running!",
      dbConnected: "Successfully connected to the database!",
      serverRunning: "Server is running at: ",
    },
    user: {
      blocked: "Users blocked.",
      unblocked: "Users unblocked.",
      deleted: "Users deleted.",
      got: "Users got.",
    },
  },
};

export default resources;
