// external imports
const express = require("express");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressListRoutes = require("express-list-routes");

// internal imports
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");
const userHandler = require("./routes/userRoutes");
const authHandler = require("./routes/authRoutes");
const categoryHandler = require("./routes/categoryRoutes");
const productHandler = require("./routes/productRoutes");
const cartHandler = require("./routes/cartRoutes");
const orderHandler = require("./routes/orderRoutes");
const blogHandler = require("./routes/blogRoutes");
const brandHandler = require("./routes/brandRoutes");

// app initialization
const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // 5 requests,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(limiter);

// load env variables
dotenv.config();

// cors
app.use(
  cors({
    origin: "https://e-commerce20.netlify.app",
    credentials: true,
  })
);

// routes
app.get("/", (req, res) => {
  const endpoints = expressListRoutes(app);
  let result = "";
  endpoints.forEach((route) => {
    result += `<li>${route.method} - <a href="${route.path}">${route.path}</a></li>`;
  });
  res.send(`
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">
   <h1>Welcome to Ecommerce API</h1>
    <h3>Available Routes</h3>
    <ul>
      ${result}
    </ul>
  </div>
  `);
});

app.use("/users", userHandler);
app.use("/auth", authHandler);
app.use("/categories", categoryHandler);
app.use("/products", productHandler);
app.use("/carts", cartHandler);
app.use("/orders", orderHandler);
app.use("/blogs", blogHandler);
app.use("/brands", brandHandler);

// 404 error
app.use(notFoundHandler);

// default error
app.use(errorHandler);

module.exports = app;
