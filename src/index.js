import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import gamesRoute from './routes/gamesRoute.js';
import categoriesRoute from './routes/categoriesRoute.js';
import customersRoute from './routes/customersRoute.js';
import rentalsRoute from './routes/rentalsRoute.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(gamesRoute);
app.use(categoriesRoute);
app.use(customersRoute);
app.use(rentalsRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);