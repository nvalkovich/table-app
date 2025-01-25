import express from "express";
import { AppDataSource } from "./data-source";
import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server works!");
});

AppDataSource.initialize()
    .then(() => {
        console.log("Connected");

        app.listen(port, () => {
            console.log(`Server starts at http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Error:", error);
    });