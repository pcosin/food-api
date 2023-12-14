const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
require('dotenv').config();

const app = express();

const connectionString = process.env.MONGODB_URI;

mongoose
  .connect(connectionString)
  .then(() => console.log("Conectado a MongoDb"))
  .catch((err) => console.log(err));

app.use(cors());
// app.use(cors({ credentials: true, origin: ["http://localhost:5173", "http://localhost:5174" ]}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT} y base de datos conectada`);
  });
