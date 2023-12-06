require("dotenv").config();
const path = require("path");
const { createServer } = require("http");

const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const { Server } = require("socket.io");

//const requestTimeMiddleware = require("./middleware/request-time");
const {viewSessionData} = require("./middleware/view-session");
const {sessionLocals} = require("./middleware/session-locals");
const {isAuthenticated} = require("./middleware/is-authenticated");

const { execPath } = require("process");

const app = express();
const httpServer = createServer(app);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended:true,
  }),
);

app.use(cookieparser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//for static for file source  that ar in the bakcend
//__dirname is direcorty name
app.use(express.static(path.join(__dirname,"static")));

//Port env set up
const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

//livereload
if (process.env.NODE_ENV === "development") {
  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");
  
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "backend", "static"));
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

  app.use(connectLiveReload());
}
//endliverelead

const sessionMiddleware = session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
})

app.use(sessionMiddleware);

if (process.env.NODE_ENV === "development") {
  app.use(viewSessionData);
}

app.use(sessionLocals);
const io = new Server(httpServer);
io.engine.use(sessionMiddleware);

//middleware called here
//app.use(requestTimeMiddleware);

const loginRoutes = require("./routes/login");
const gamelobbyRoutes = require("./routes/gamelobby");
const signupRoutes = require("./routes/signup");
const authtRoutes = require("./routes/authentication");
const playerroomRoutes = require("./routes/playerroom");

app.use("/", signupRoutes);
app.use("/authentication", authtRoutes);
app.use("/gamelobby", isAuthenticated, gamelobbyRoutes);
app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);
app.use("/playerroom", isAuthenticated, playerroomRoutes);
app.use((_request, _response, next)=>{
    next(createError(404));


//app.use("/", rootRoutes);

//http error  localHost:3000/eljlekj
app.use((_request, _response, next) => {
  next(createError(404));
});

//listen on port once its start the function will excute.
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
});