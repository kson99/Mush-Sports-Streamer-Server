const express = require("express");
const router = express.Router();

const axios = require("axios");
const cheerio = require("cheerio");

router.post("/", async (req, res) => {
  const url = req.body.url;
  let data = {};

  await axios
    .get(url)
    .then((response) => {
      const HTML = response.data;
      const $ = cheerio.load(HTML);
      const data1 = [];

      const leagueLogo = $(".sv-box .header .logo img").attr("src");
      const leagueName = $(".sv-box .header .logo img").attr("alt");
      const date = $(".sv-box .header .title span").text().trim();

      $(".table tr").each(function () {
        let obj = {};

        $(this)
          .find("td")
          .each(function () {
            const text = $(this).html();

            if (text.includes(" ") && text.length > 3) {
              obj = {
                ...obj,
                name: $(this).find("a").attr("title"),
              };
            }

            if (text.includes("<a")) {
              obj = {
                ...obj,
                link: $(this).find("a").attr("href"),
                title: $(this).find("a").text(),
              };
            }

            if (text === "HD" || text === "SD") {
              obj = {
                ...obj,
                quality: text,
              };
            }

            if (text.length > 3 && text.length < 10) {
              obj = {
                ...obj,
                language: text,
              };
            }

            if (text.length === 1) {
              obj = {
                ...obj,
                ads_count: text,
              };
            }
          });

        data1.push(obj);
      });
      data1.shift();

      data = {
        streams: data1,
        info: { leagueName, leagueLogo, date },
      };
    })
    .catch((err) => {
      console.log("An error has occured: " + [err]);
    });
  res.json(data);
});

module.exports = router;
