const express = require("express")
const morgan = require("morgan")
const cors = require("cors");
const dotenv = require('dotenv');

const app = express()
var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(morgan("combined"))
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello." });
});

dotenv.config();

require('crypto').randomBytes(64).toString('hex')

require("./routes/userRoutes")(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
