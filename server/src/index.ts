import express from "express";
import cors from "cors";
import routes from "./routes/routes.js"; 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/", routes); // or whatever prefix you want

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
