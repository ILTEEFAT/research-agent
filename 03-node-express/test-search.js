require("dotenv").config();

const { tavily } = require("@tavily/core");

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

async function testSearch() {
  try {
    const response = await tvly.search(
      "Artificial Intelligence in healthcare",
      {
        search_depth: "basic",
        max_results: 5,
      },
    );

    console.log("\nSEARCH RESULTS:\n");

    response.results.forEach((result, index) => {
      console.log(`\n--- SOURCE ${index + 1} ---`);
      console.log("Title:", result.title);
      console.log("URL:", result.url);
      console.log("Content:", result.content);
      console.log("Score:", result.score);
    });
  } catch (error) {
    console.error("Tavily error:", error);
  }
}

testSearch();
