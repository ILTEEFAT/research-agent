const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");
const { tavily } = require("@tavily/core");
require("dotenv").config();

const app = express();
const PORT = 3000;

// ========================================
// Middleware
// ========================================

app.use(cors());
app.use(express.json());

// ========================================
// Frontend
// ========================================

const frontendDirectory = path.join(
    __dirname,
    "..",
    "01-javascript-foundations"
);

app.use(express.static(frontendDirectory));

app.get("/", (req, res) => {
    res.sendFile(
        path.join(frontendDirectory, "index.html")
    );
});

// ========================================
// AI Services
// ========================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY
});

// ========================================
// Research Output Directory
// ========================================

const researchOutputDirectory = path.join(
    __dirname,
    "research-output"
);

if (!fs.existsSync(researchOutputDirectory)) {
    fs.mkdirSync(researchOutputDirectory, {
        recursive: true
    });
}

// ========================================
// Health Check
// ========================================

app.get("/api/hello", (req, res) => {
    res.json({
        message:
            "Research Assistant backend is running."
    });
});

// ========================================
// Research Endpoint
// ========================================

app.post("/api/research", async (req, res) => {

    const topic = req.body.topic?.trim();

    if (!topic) {
        return res.status(400).json({
            error: "Research topic is required."
        });
    }

    console.log("\n================================");
    console.log("Research topic:", topic);
    console.log("================================\n");

    try {

        // ========================================
        // STEP 1 — Search Web
        // ========================================

        console.log("Searching the web...");

        const searchResponse =
            await tvly.search(topic, {
                maxResults: 5,
                searchDepth: "advanced",
                includeAnswer: false
            });

        const searchResults =
            searchResponse.results || [];

        console.log(
            `Sources found: ${searchResults.length}`
        );

        if (searchResults.length === 0) {
            return res.status(404).json({
                error:
                    "No useful sources were found."
            });
        }

        // ========================================
        // STEP 2 — Normalize Sources
        // ========================================

        const sources = searchResults.map(
            (source, index) => {

                return {
                    id: index + 1,

                    title:
                        source.title ||
                        `Source ${index + 1}`,

                    url: source.url,

                    content:
                        source.content ||
                        source.rawContent ||
                        "",

                    score:
                        source.score ?? null
                };
            }
        );

        // ========================================
        // STEP 3 — Build Research Context
        // ========================================

        const researchContext =
            sources
                .map((source) => {

                    return `
SOURCE ${source.id}

Title:
${source.title}

URL:
${source.url}

Content:
${source.content}
`;

                })
                .join(
                    "\n-------------------------\n"
                );

        // ========================================
        // STEP 4 — Generate AI Research
        // ========================================

        console.log(
            "Generating AI research..."
        );

        const prompt = `
You are an expert research synthesizer.

Research topic:
"${topic}"

You have been given information retrieved
from multiple web sources.

Create a clear, factual, well-structured
research report based ONLY on the provided
sources.

IMPORTANT RULES:

1. Use ONLY information contained in the
   provided sources.

2. Do not invent facts, statistics,
   examples, or citations.

3. Every important factual claim should
   include a citation such as [Source 1].

4. If sources disagree, explicitly
   mention the disagreement.

5. Do not pretend a source says something
   it does not say.

6. Prefer information supported by
   multiple sources.

7. Keep the report concise but useful.

8. Do NOT create a Sources section.
   The application will create it.

9. Use Markdown.

Use exactly this structure:

## Overview

Explain the topic clearly.

## Key Findings

Present the most important findings.

## Applications & Developments

Explain important applications,
developments, or examples.

## Why It Matters

Explain why the topic is important.

## Challenges & Limitations

Explain risks, limitations,
disagreements, or unresolved issues.

## Conclusion

Give a concise synthesis.

WEB SOURCES:

${researchContext}
`;

        const response =
            await ai.models.generateContent({
                model: "gemini-3.5-flash",
                contents: prompt
            });

        const researchReport =
            response.text;

        if (!researchReport) {
            throw new Error(
                "Gemini returned an empty response."
            );
        }

        console.log(
            "AI research generated successfully."
        );

        // ========================================
        // STEP 5 — Create Filename
        // ========================================

        const timestamp =
            new Date().toISOString();

        const safeTopic =
            topic
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
                .substring(0, 80);

        const filename =
            `${safeTopic}-${timestamp
                .replace(/[:.]/g, "-")}.md`;

        const filePath =
            path.join(
                researchOutputDirectory,
                filename
            );

        // ========================================
        // STEP 6 — Obsidian Frontmatter
        // ========================================

        const frontmatter = `---
title: "${topic.replace(/"/g, '\\"')}"
created: "${timestamp}"
type: research
tags:
  - research
  - ai-generated
---

`;

        // ========================================
        // STEP 7 — Sources
        // ========================================

        const sourcesMarkdown =
            sources
                .map((source) => {
                    return `- [${source.title}](${source.url})`;
                })
                .join("\n");

        // ========================================
        // STEP 8 — Create Obsidian Note
        // ========================================

        const obsidianNote =
            frontmatter +
            researchReport +
            `

---

## Sources

${sourcesMarkdown}

---

*Generated by Research Assistant*
`;

        fs.writeFileSync(
            filePath,
            obsidianNote,
            "utf8"
        );

        console.log(
            "\nObsidian note created:"
        );

        console.log(filePath);

        // ========================================
        // STEP 9 — Send Result to Frontend
        // ========================================

        res.json({

            message: researchReport,

            sources:
                sources.map((source) => {

                    return {
                        id: source.id,
                        title: source.title,
                        url: source.url,
                        score: source.score
                    };

                }),

            note: {
                filename: filename,
                markdown: obsidianNote
            }

        });

    } catch (error) {

        console.error(
            "\nResearch error:",
            error
        );

        res.status(500).json({

            error:
                error.message ||
                "Research failed."

        });
    }
});

// ========================================
// Start Server
// ========================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});