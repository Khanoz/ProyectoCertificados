const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer"); // v1.0.5
const cors = require("cors");
const cliArgs = require("./appSetup.js");
const authEndpoint = require("./routes/auth.js");
const userEndpoint = require("./routes/user.js");
const viewEndpoint = require("./routes/view.js");
const eventEndpoint = require("./routes/event.js");
const middlewares = require("./middlewares");
const { checkSchema } = require("express-validator");
const validators = require("./validators");

const app = express();
require("./swagger")(app);

// App config
var corsOptions = {
  origin: "*", // TODO: Cambiar los orígenes permitidos
  optionsSuccessStatus: 200,
};

// Built-in middlewares
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors(corsOptions));

// Multer for multipart/form auto file uploads
const storage = multer.diskStorage({
  destination: function (_, _, cb) {
    cb(null, process.env.MEDIA_PATH);
  },
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Static files
app.use("/media", express.static("uploads"));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Auth
app.post(
  "/auth/login",
  checkSchema(validators.loginValidator()),
  authEndpoint.login
);
app.post(
  "/auth/register",
  checkSchema(validators.loginValidator()),
  authEndpoint.register
);
app.post(
  "/auth/recover",
  checkSchema(validators.emailValidation()),
  authEndpoint.recoverEmail
);

// View
app.get("/view/user-rols", middlewares.jwtProtected, viewEndpoint.getUserRols);
app.get("/view/upcoming", eventEndpoint.getUpcomingEvents);
app.get("/view/hottest", eventEndpoint.getHottestEvent);
app.get("/view/closeDates", eventEndpoint.getCloseDateEvents)

// User
app.get("/user", middlewares.jwtProtected, userEndpoint.getUser);
app.post(
  "/user/bind-new-user",
  middlewares.jwtProtected,
  // NOTE: Por alguna razon el validator no funciona con forms, es como que el body-parser no trabaja pero en cuanto lo invoca
  // el multer hace el parse y ya funciona el validator. El workaround que se me ocurrió, llamar a multer siempre que trabaje
  // con forms aunque no haga falta cargar nada, multer tiene upload.none() y llamarlo soluciona el problema
  upload.single("image"),
  // upload.none(),
  checkSchema(
    validators.notEmptyValidator(
      "names",
      "lastNames",
      "nickname",
      "birthday",
      "rol"
    )
  ),
  userEndpoint.bindNewUser
);

// Event
app.get(
  "/event/subscribe/:eventId",
  middlewares.jwtProtected,
  eventEndpoint.subscribeUserToEvent
);
app.get(
  "/event/unsubscribe/:eventId",
  middlewares.jwtProtected,
  eventEndpoint.unsubscribeUserToEvent
);
app.get("/event/:eventId", eventEndpoint.getEvent);
app.post(
  "/event/:eventId?",
  middlewares.jwtProtected,
  upload.array("images"),
  checkSchema(
    validators.notEmptyValidator(
      "name",
      "description",
      "date",
      "place",
      "capacity"
    )
  ),
  eventEndpoint.upsertEvent
);
app.delete(
  "/event/:eventId",
  middlewares.jwtProtected,
  eventEndpoint.deleteEvent
);

// Middleware not found
app.use(middlewares.notFound);

// Server
const server = app.listen(cliArgs.port, cliArgs.bind, () => {
  console.log(
    `Running backend service over http://${cliArgs.bind}:${cliArgs.port} -- ${process.env.ENV} mode`
  );
});
server.timeout = parseInt(process.env.REQ_TIMEOUT_SECS) * 1000;
