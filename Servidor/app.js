import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./router/router.product.js";

dotenv.config();
const app = express();

app.use(express.json());

const corsOptions = {
  origin: '*',
  methods: 'GET, POST, PUT, DELETE, OPTIONS'
}

app.use(cors(corsOptions))
app.use("/voyant", router);

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
  });
}

export default app;