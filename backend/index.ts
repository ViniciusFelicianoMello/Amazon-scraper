// Importing the required libraries
import express from "express";
import type { Request, Response } from "express";
import axios from "axios";
import { JSDOM } from "jsdom";
import cors from "cors";

// Starting the Express application and setting the server port
const app = express();
const PORT = 3000;

// Using CORS to allow requests from other domains
app.use(cors());

// Defining the route that will perform the scraping and getting the 'keyword' parameter sent in the URL query string
app.get("/api/scrape", async (req: Request, res: Response) => {
    const keyword = req.query.keyword as string;

    // Checking if the 'keyword' parameter was passed and if not, returns error 400 with an explanatory message
    if (!keyword) {
        return res.status(400).json({ error: "Parâmetro 'keyword' é obrigatório" });
    }

    // Building the URL for searching on Amazon based on the 'keyword' parameter and making the HTTP request to retrieve the Amazon page with Axios
    try {
        const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
        const { data } = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        const dom = new JSDOM(data);
        const document = dom.window.document;

        // Using JSDOM to parse the HTML page and manipulate it as a DOM document, selecting all the product items listed on the page and extracting information from each item in the product list
        const items = [...document.querySelectorAll('.s-result-item[data-asin]')];
        const products = items.map(item => {
            const title = item.querySelector('h2 span')?.textContent?.trim() || "Sem título";
            const rating = item.querySelector('.a-icon-alt')?.textContent?.split(" ")[0] || "Sem nota";
            const reviews = item.querySelector('.a-size-base')?.textContent || "0";
            const image = item.querySelector('img')?.getAttribute('src') || "";

            return { title, rating, reviews, image };
        }).filter(p => p.title !== "Sem título");

        // Returns the found products in JSON format
        res.json({ keyword, products });
    } catch (err) {
        res.status(500).json({ error: "Erro ao coletar dados da Amazon" });
    }
});

// Start the server and listen on the defined port
app.listen(PORT, () => console.log(`✅ Backend rodando em http://localhost:${PORT}`));
