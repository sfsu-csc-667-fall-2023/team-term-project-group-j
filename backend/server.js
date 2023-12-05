require("dotenv").config();
const testRoutes = require("./routes/test/index.js");
//app.use("/test", testRoutes);

const path = require("path");
const express = require("express");
const createError = require("http-errors");
const requestTimeMiddleware = require("./middleware/request-time");
const session = require("express-session");

const { execPath } = require("process");

const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");

const morgan = require("morgan");
const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.use(cookieparser());
//Port env set up
const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

//livereload
if (process.env.NODE_ENV === "development") {
  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");
  const{viewSessionData }= require("./middleware/view-session");
  app.use(viewSessionData);
  const liveReloadServer = livereload.createServer();

  liveReloadServer.watch(path.join(__dirname, "backend", "static"));

  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

  app.use(connectLiveReload());
}

app.use (session({
  secret: process.env.SESSION_SECRATE,
  resave: false,
  saveUninitialized: true,
  cookie:{secure: true}
}))
//endliverelead

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//for static for file source  that ar in the bakcend
//__dirname is direcorty name
app.use(express.static(path.join(__dirname,"static")));

const loginRoutes = require("./routes/login");
const gamelobbyRoutes = require("./routes/gamelobby");
const signupRoutes = require("./routes/signup");
const authtRoutes = require("./routes/authentication");
//middleware called here
app.use(requestTimeMiddleware);
app.use("/", signupRoutes);

app.use("/authentication", authtRoutes);
app.use("/gamelobby", gamelobbyRoutes);
app.use("/signup", signupRoutes);
app.use("/login", loginRoutes);
app.use((_request, _response, next)=>{
    next(createError(404));
app.use(express.static(path.join(__dirname, "static")));


app.use("/", rootRoutes);
//http error  localHost:3000/eljlekj
app.use((_request, _response, next) => {
  next(createError(404));
});

//listen on port once its start the function will excute.
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
});




