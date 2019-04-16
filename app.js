const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const hbs = require("express-hbs");  // https://github.com/barc/express-hbs
const intl = require("handlebars-intl");  // https://formatjs.io/handlebars/
const session = require("express-session");  // https://github.com/expressjs/session

const index = require("./routes/index");
const query = require("./controller/query-controller");
const connectionListener = require("./listener/connectionListener");

const app = express();

// view engine setup
app.set("view engine", "hbs");

app.engine("hbs", hbs.express4({
    defaultLayout: __dirname + "/views/layouts/default.hbs",
    partialsDir: __dirname + "/views/partials",
    layoutsDir: __dirname + "/views/layouts"
}));

intl.registerWith(hbs);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, "public")));

// res.locals is an object passed to hbs engine
app.use(function (req, res, next)
{
    res.locals.session = req.session;
    next();
});

app.use("/", index);
connectionListener.openConnection();
query.startQueryStream();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
