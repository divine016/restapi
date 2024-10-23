const elevatorController = require("../controllers/elevator.controller");
const Keycloak = require("keycloak-connect");
const session = require('express-session');

// Load environment variables
const USER_ROLE = process.env.USER_ROLE || 'express-user';
const ADMIN_ROLE = process.env.ADMIN_ROLE || 'express-admin';
const CLIENT_ID = process.env.AUTH_CLIENT_ID || "secure-express-service";
const AUTH_SERVER = process.env.AUTH_SERVER || "http://localhost:8080";
const AUTH_REALM = process.env.AUTH_REALM || "master";

// Keycloak configuration
const kcConfig = {
  clientId: CLIENT_ID,
  bearerOnly: true,
  serverUrl: AUTH_SERVER,
  realm: AUTH_REALM,
};

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

// Custom access denied message
Keycloak.prototype.accessDenied = function (request, response) {
  response.status(401);
  response.json({
    status: 401,
    message: "Unauthorized/Forbidden",
    result: { errorCode: "ERR-401", errorMessage: "Unauthorized/Forbidden" },
  });
};

// Express session middleware
const sessionMiddleware = session({
  secret: process.env.APP_SECRET || "BV&%R*BD66JH",
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
});

// Middleware for protecting routes based on role
function roleProtected(role) {
  return keycloak.protect((token) => {
    const roles = token.content.realm_access.roles;
    return roles.includes(role);
  });
}

module.exports = function (router) {
  // Apply session and Keycloak middleware
  router.use(sessionMiddleware);
  router.use(keycloak.middleware());

  // Admin-only route for elevator status check
  router.get(
    "/elevatorStatusCheck",
    roleProtected(ADMIN_ROLE), // Protect route for 'admin' role
    elevatorController.statusCheck
  );

  // Authenticated user route for requesting elevator
  router.post(
    "/requestElevator",
    keycloak.protect(), // Protect route for any authenticated user
    elevatorController.requestElevator
  );
};

