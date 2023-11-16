import axios from "axios";
import * as cheerio from "cheerio";
import express from "express";
import cors from "cors"; // to solve CORS errors

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/scrape", (req, res) => {
  const keyword = req.query.keyword; // to access the keyword query parameter

  if (!keyword) {
    return res.status(400).send("Missing keyword parameter");
  }

  // in the amazon search url, the user search term comes after the "s?k=" substring
  const searchURL = `https://www.amazon.com/s?k=${keyword}`;

  axios
    .get(searchURL)
    .then((response) => {
      const html = response.data;

      // parsing the response data using cheerio
      const $ = cheerio.load(html);

      // upon inspecting, all the necessary product information can be found
      // within divs with the name "puis-card-container"
      // we can select the elements on the page that have this class name
      // and store them in a "rows" variable
      const rows = $(".puis-card-container");
      const products = [];

      for (const row of rows) {
        // we can scrape through the elements found within the selected rows using .find
        const productData = {
          name: $(row).find("span.a-text-normal").text(),
          rating: $(row).find(".a-icon-alt").text().slice(0, 3), // we only really need the first 3 characters of the rating (etc. 4.5)
          reviewCount: $(row).find("span.a-size-base.s-underline-text").text(),
          imageUrl: $(row).find(".s-image").attr("src"), // to get the image url, we can select the src attribute of the image with .attr("src")
        };
        products.push(productData);
      }
      console.log(products);
      res.json(products);
    })
    .catch((err) => {
      console.error("Error:", err);
      res.status(500).send("An error occurred");
    });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
