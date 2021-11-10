require("dotenv").config();
const MongooseLoader = require("./loaders/MongooseLoader");
const compression = require("compression");
const path = require("path");
const cors = require("cors");
const ItemsRouter = require("./routes/item-routes");
const UserRouter = require("./routes/user-routes");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("../openapi.json");
const { errorParser } = require("./middleware/error-handler");
const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", ItemsRouter);
app.use("/", UserRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
app.use(errorParser);

MongooseLoader();

module.exports = app;
