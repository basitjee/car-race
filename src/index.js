import "@babel/polyfill";
import express from "express";
import { topUsers } from "./topUsers";
import { users } from "./users";

const app = express();
app.use(express.json());

app.get("/topActiveUsers", (req, res) => topUsers(req, res));

app.get("/users", async (req, res) => users(req, res));

// Identifing port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("listening to port " + port));
