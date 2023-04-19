const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ugyfelekRoutes = require("./routes/ugyfelekRoutes.js");
const truckRoutes = require("./routes/truckRoutes.js");
const soforRoutes = require("./routes/soforRoutes.js");
const telephelyRoutes = require("./routes/telephelyRoutes.js");
const dijtablaRoutes = require("./routes/dijtablaRoutes.js");

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB Atlas
mongoose.connect(
  "mongodb+srv://borisz0929:yW9M9KivNC1XVdW1@cluster0.foweg.mongodb.net/DirectionsDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});

// Routes
app.use("/api/ugyfelek", ugyfelekRoutes);
app.use("/api/trucks", truckRoutes);
app.use("/api/sofors", soforRoutes);
app.use("/api/telephelyek", telephelyRoutes);
app.use("/api/dijtablak", dijtablaRoutes);

// Start server
const port = 3500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
