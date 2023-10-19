// database connection
const app = require("./app");
const connectDB = require("./config/db");
const port = process.env.PORT || 9000;

// server listen
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await connectDB();
});
