const express = require("express");
const router = express.Router();

const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", async (req, res) => {
  const liveGames = [];

  await axios
    .get("https://totalsportek.pro/soccer5/")
    .then((response) => {
      const HTML = response.data;
      const $ = cheerio.load(HTML);

      $(".order-md-2 .nav-link2").each(function () {
        const text = $(this).text().trim();
        const team1 = text.slice(
          text.indexOf("\n", text.indexOf("\n")),
          text.lastIndexOf("\n")
        );
        let teamLogo = [];

        const team2 = text.slice(text.lastIndexOf("\n"));

        $(this)
          .find("img")
          .each(function () {
            const imageUrl = $(this).attr("src");
            teamLogo.push(imageUrl);
          });

        const time = text.slice(0, text.indexOf("\n"));

        const url = $(this).attr("href");

        let data = {
          time: time,
          team1: team1.trim(),
          team1Logo: teamLogo[0]?.replaceAll(" ", "%20"),
          team2: team2.trim(),
          team2Logo: teamLogo[1]?.replaceAll(" ", "%20"),
          url: url,
        };

        if (!JSON.stringify(liveGames).includes(JSON.stringify(data))) {
          liveGames.push(data);
        }
      });
    })
    .catch((err) => {
      console.log("an error occured", { err });
    });

  for (let i = liveGames.length + 1; i >= 0; i--) {
    const liveGame = liveGames[i];

    if (liveGame?.team1 === "" || liveGame?.team2 === "") {
      const index = liveGames.indexOf(liveGame);
      liveGames.splice(index, 1);
      // console.log(index);
    }
  }

  res.json(liveGames);
});

module.exports = router;
