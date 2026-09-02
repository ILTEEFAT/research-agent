# Research Agent

> Evidence-backed AI research from the web, synthesized and ready for Obsidian.

Research Agent is an AI-powered research workflow that searches the web, collects relevant sources, synthesizes information using Gemini, preserves source citations, and exports the final research as structured Markdown for Obsidian.

The goal is to go beyond a generic AI summary by keeping the generated answer grounded in retrieved web sources.

## ✨ Features

- 🔎 **Web Research** — searches the web using Tavily
- 🧠 **AI Synthesis** — combines information from multiple sources using Gemini
- 📚 **Source Citations** — connects claims in the report back to retrieved sources
- 📝 **Obsidian Export** — generates structured Markdown with frontmatter
- 📋 **Copy Report** — quickly copy the generated research
- 📄 **Markdown Preview** — inspect the Obsidian-ready note before using it
- ⚡ **Simple Web Interface** — enter a topic and run the complete workflow from one page

## 🧩 How It Works

```text
                    Research Query
                          │
                          ▼
                 ┌─────────────────┐
                 │   Web Search    │
                 │     Tavily      │
                 └────────┬────────┘
                          │
                    Retrieved Sources
                          │
                          ▼
                 ┌─────────────────┐
                 │  Source Context │
                 │  + Instructions │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Gemini AI Model │
                 │   Synthesis     │
                 └────────┬────────┘
                          │
                          ▼
                 Evidence-backed
                    Research
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
       Web Report UI           Obsidian Markdown
                                      │
                                      ▼
                                  .md Note
🛠️ Tech Stack
Frontend
HTML
CSS
JavaScript
Fetch API
Backend
Node.js
Express.js
CORS
AI & Research
Tavily Search API
Google Gemini API
Knowledge Management
Obsidian-compatible Markdown
YAML frontmatter
📁 Project Structure
research-agent/
│
├── 01-javascript-foundations/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── 03-node-express/
│   ├── server.js
│   ├── test-search.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .gitignore
│   └── research-output/
│
└── README.md
🚀 Getting Started
1. Clone the repository
git clone https://github.com/ILTEEFAT/research-agent.git
cd research-agent
2. Install backend dependencies
cd 03-node-express
npm install
3. Configure API keys

Create a .env file inside 03-node-express:

TAVILY_API_KEY=your_tavily_api_key
GEMINI_API_KEY=your_gemini_api_key

Never commit your .env file or expose API keys in frontend code.

4. Start the application
node server.js

The application will be available at:

http://localhost:3000
🔬 Usage
Open the application in your browser.
Enter a research topic.
Click Research.
The backend searches the web using Tavily.
Retrieved sources are passed to Gemini for grounded synthesis.
The generated report is displayed with source citations.
Review the retrieved evidence.
Copy the report or Obsidian-ready Markdown.
The Markdown note is also generated in:
03-node-express/research-output/
📌 Example

A query such as:

The future of robotics in healthcare

produces:

A synthesized research report
Retrieved web sources
Source references inside the report
An Obsidian-compatible Markdown note
🎯 Design Goal

The project is designed around a simple principle:

AI-generated research should remain connected to its evidence.

Instead of asking an LLM to answer a question from its internal knowledge alone, Research Agent first retrieves relevant web sources and then asks the model to synthesize the supplied evidence.

This makes the workflow more useful for research, learning, documentation, and personal knowledge management.

🔮 Future Improvements

Potential extensions include:

Claim-level evidence extraction
Support / contradiction detection between sources
Source quality scoring
Retrieval-augmented generation (RAG)
Multi-query research planning
Research history
Automatic Obsidian vault integration
Improved source deduplication
Streaming AI responses
👨‍💻 Project Status

MVP — Functional

The current version demonstrates the complete core workflow:

Search → Retrieve Sources → AI Synthesis → Citations → Obsidian Export

Built as a practical Generative AI engineering project.


### One thing before we commit this

**Don't paste it yet.**

I want to make sure the README matches the **actual implementation exactly**, especially the API setup and project structure. Since we're at the final polish stage, we shouldn't put anything in the README that the code doesn't actually do.

Send me your current **`server.js`** and **`package.json`** (you can paste both here), and I'll rewrite the README to be 100% aligned with your implementation, then we'll make the final README commit.
