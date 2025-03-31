"use strict";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import apiLimiter from "../src/middlewares/rate-limit-validator.js";
import authRoutes from "../src/auth/auth.routes.js";
import carRoutes from "../src/car/car.routes.js";
import { swaggerDocs, swaggerUi } from "./swagger.js";
import { cloudinary } from './cloudinary.js'; 
import "../configs/firebase.js";
import dotenv from "dotenv";
dotenv.config();

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan("dev"));
    app.use(apiLimiter);
};

const routes = (app) => {
    app.use("/parking/v1/auth", authRoutes);
    app.use("/parking/v1/cars", carRoutes);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

const conectarDB = async () => {
    try {
      console.log("Firebase Firestore conectado");
    } catch (err) {
      console.log(`Error en la conexión con Firestore: ${err}`);
      process.exit(1);
    }
  };

export const initServer = () => {
    const app = express();
    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(process.env.PORT);
        console.log(`Server running on port ${process.env.PORT}`);
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
};
