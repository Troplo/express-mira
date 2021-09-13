let express = require("express");
let app = express();
let config = "./config/config.json"
let port = config.port || 23983;
let cors = require("cors");
let helmet = require("helmet");
let bodyParser = require("body-parser");

app.use(cors());
app.use(helmet());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(`/api/v1/auth`, require("./routes/v1/auth.js"));
app.use(`/api/v1/user`, require("./routes/v1/user.js"));
app.use(`/api/v1/library`, require("./routes/v1/library.js"));

app.use(require('./lib/errorHandler'))
app.set('trust proxy', true)

app.listen(port, () => console.log(`Express-Mira started on port: ${port}`));