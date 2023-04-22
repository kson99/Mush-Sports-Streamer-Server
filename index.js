const PORT = process.env.PORT || 1999;
const express = require("express");
const cors = require("cors");
const upcomingGames = require("./route/upcomingGames");
const gameLinks = require("./route/gameLinks");

const app = express();
app.use(cors());

app.use(express.json());
app.use("/upcomingGames", upcomingGames);
app.use("/gameLinks", gameLinks);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
