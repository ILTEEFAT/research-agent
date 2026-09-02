const researchInput =
    document.getElementById("researchQuery");

const searchButton =
    document.getElementById("researchButton");

const buttonText =
    document.getElementById("buttonText");

const loadingSpinner =
    document.getElementById("loadingSpinner");

const statusDisplay =
    document.getElementById("statusDisplay");

const stats =
    document.getElementById("stats");

const sourceCount =
    document.getElementById("sourceCount");

const reportSection =
    document.getElementById("reportSection");

const reportTitle =
    document.getElementById("reportTitle");

const reportDisplay =
    document.getElementById("report");

const sourcesSection =
    document.getElementById("sourcesSection");

const sourcesDisplay =
    document.getElementById("sources");

const sourceSummary =
    document.getElementById("sourceSummary");

const exportSection =
    document.getElementById("exportSection");

const copyReportButton =
    document.getElementById("copyReportButton");

const copyMarkdownButton =
    document.getElementById("copyMarkdownButton");


let latestResearchReport = "";

let latestObsidianMarkdown = "";


// ==========================================
// Markdown → HTML
// ==========================================

function markdownToHtml(markdown) {

    let html =
        markdown
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");


    // Headings
    html = html.replace(
        /^### (.*)$/gm,
        "<h3>$1</h3>"
    );

    html = html.replace(
        /^## (.*)$/gm,
        "<h2>$1</h2>"
    );

    html = html.replace(
        /^# (.*)$/gm,
        "<h1>$1</h1>"
    );


    // Horizontal rule
    html = html.replace(
        /^---$/gm,
        "<hr>"
    );


    // Bold
    html = html.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );


    // Italic
    html = html.replace(
        /(?<!\*)\*(?!\*)(.*?)\*(?!\*)/g,
        "<em>$1</em>"
    );


    // Citations
    html = html.replace(
        /\[Source ([0-9,\s]+)\]/g,
        '<span class="citation">Source $1</span>'
    );


    // Bullet points
    html = html.replace(
        /^\* (.*)$/gm,
        "<li>$1</li>"
    );

    html = html.replace(
        /^- (.*)$/gm,
        "<li>$1</li>"
    );


    // Wrap consecutive list items
    html = html.replace(
        /((?:<li>.*<\/li>\s*)+)/gs,
        "<ul>$1</ul>"
    );


    // Paragraphs
    html = html.replace(
        /\n\n+/g,
        "</p><p>"
    );


    html =
        "<p>" +
        html +
        "</p>";


    // Clean heading wrappers
    html = html
        .replace(
            /<p>\s*<h1>/g,
            "<h1>"
        )
        .replace(
            /<\/h1>\s*<\/p>/g,
            "</h1>"
        )
        .replace(
            /<p>\s*<h2>/g,
            "<h2>"
        )
        .replace(
            /<\/h2>\s*<\/p>/g,
            "</h2>"
        )
        .replace(
            /<p>\s*<h3>/g,
            "<h3>"
        )
        .replace(
            /<\/h3>\s*<\/p>/g,
            "</h3>"
        )
        .replace(
            /<p>\s*<hr>\s*<\/p>/g,
            "<hr>"
        )
        .replace(
            /<p>\s*<ul>/g,
            "<ul>"
        )
        .replace(
            /<\/ul>\s*<\/p>/g,
            "</ul>"
        );


    return html;
}


// ==========================================
// Loading State
// ==========================================

function setLoadingState(isLoading) {

    searchButton.disabled =
        isLoading;


    if (isLoading) {

        buttonText.textContent =
            "Researching";

        loadingSpinner.classList.remove(
            "hidden"
        );

        statusDisplay.textContent =
            "🔎 Searching the web and synthesizing sources...";

    } else {

        buttonText.textContent =
            "Research";

        loadingSpinner.classList.add(
            "hidden"
        );
    }
}


// ==========================================
// Clear Results
// ==========================================

function clearResults() {

    stats.classList.add(
        "hidden"
    );

    reportSection.classList.add(
        "hidden"
    );

    sourcesSection.classList.add(
        "hidden"
    );

    exportSection.classList.add(
        "hidden"
    );


    reportDisplay.innerHTML =
        "";

    sourcesDisplay.innerHTML =
        "";


    sourceCount.textContent =
        "0";

    sourceSummary.textContent =
        "0 sources";


    latestResearchReport =
        "";

    latestObsidianMarkdown =
        "";
}


// ==========================================
// Display Sources
// ==========================================

function displaySources(sources) {

    sourcesDisplay.innerHTML =
        "";


    sources.forEach(
        function (source) {

            const card =
                document.createElement("a");

            card.className =
                "source-card";

            card.href =
                source.url;

            card.target =
                "_blank";

            card.rel =
                "noopener noreferrer";


            const number =
                document.createElement("span");

            number.className =
                "source-number";

            number.textContent =
                source.id;


            const title =
                document.createElement("span");

            title.className =
                "source-title";

            title.textContent =
                source.title;


            const url =
                document.createElement("span");

            url.className =
                "source-url";

            url.textContent =
                source.url;


            card.appendChild(
                number
            );

            card.appendChild(
                title
            );

            card.appendChild(
                url
            );


            sourcesDisplay.appendChild(
                card
            );
        }
    );


    sourceCount.textContent =
        sources.length;

    sourceSummary.textContent =
        `${sources.length} sources`;
}


// ==========================================
// Copy to Clipboard
// ==========================================

async function copyToClipboard(
    text,
    button,
    successText
) {

    if (!text) {
        return;
    }


    try {

        await navigator.clipboard.writeText(
            text
        );


        const originalText =
            button.textContent;


        button.textContent =
            successText;


        setTimeout(
            function () {

                button.textContent =
                    originalText;

            },
            1800
        );


    } catch (error) {

        console.error(
            "Copy failed:",
            error
        );


        statusDisplay.textContent =
            "❌ Could not copy to clipboard.";
    }
}


// ==========================================
// Research
// ==========================================

async function performResearch() {

    const userText =
        researchInput.value.trim();


    if (!userText) {

        statusDisplay.textContent =
            "Please enter a research topic.";

        researchInput.focus();

        return;
    }


    console.log(
        "Research Query:",
        userText
    );


    clearResults();

    setLoadingState(true);


    try {

        // ==================================
        // Send request to backend
        // ==================================

        const response =
            await fetch(
                "http://localhost:3000/api/research",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            topic:
                                userText
                        })
                }
            );


        const data =
            await response.json();


        console.log(
            "Backend Response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Research failed."
            );
        }


        // ==================================
        // Save results
        // ==================================

        latestResearchReport =
            data.message || "";


        latestObsidianMarkdown =
            data.note?.markdown || "";


        // ==================================
        // Status
        // ==================================

        statusDisplay.textContent =
            "✅ Research completed successfully.";


        // ==================================
        // Stats
        // ==================================

        stats.classList.remove(
            "hidden"
        );


        // ==================================
        // Report
        // ==================================

        reportSection.classList.remove(
            "hidden"
        );


        reportTitle.textContent =
            userText;


        reportDisplay.innerHTML =
            markdownToHtml(
                latestResearchReport
            );


        // ==================================
        // Sources
        // ==================================

        sourcesSection.classList.remove(
            "hidden"
        );


        displaySources(
            data.sources || []
        );


        // ==================================
        // Obsidian Export
        // ==================================

        if (
            latestObsidianMarkdown
        ) {

            exportSection.classList.remove(
                "hidden"
            );
        }


        // ==================================
        // Scroll to report
        // ==================================

        reportSection.scrollIntoView({
            behavior:
                "smooth",

            block:
                "start"
        });


    } catch (error) {

        console.error(
            "Research error:",
            error
        );


        statusDisplay.textContent =
            "❌ Research failed.";


        reportSection.classList.remove(
            "hidden"
        );


        reportTitle.textContent =
            "Research failed";


        reportDisplay.innerHTML =
            "";


        const errorBox =
            document.createElement("div");


        errorBox.className =
            "error-message";


        errorBox.textContent =
            error.message;


        reportDisplay.appendChild(
            errorBox
        );


    } finally {

        setLoadingState(false);
    }
}


// ==========================================
// Research Button
// ==========================================

searchButton.addEventListener(
    "click",
    performResearch
);


// ==========================================
// Enter Key
// ==========================================

researchInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            performResearch();
        }
    }
);


// ==========================================
// Copy Report
// ==========================================

copyReportButton.addEventListener(
    "click",
    function () {

        copyToClipboard(
            latestResearchReport,
            copyReportButton,
            "✓ Copied"
        );
    }
);


// ==========================================
// Copy Obsidian Markdown
// ==========================================

copyMarkdownButton.addEventListener(
    "click",
    function () {

        copyToClipboard(
            latestObsidianMarkdown,
            copyMarkdownButton,
            "✓ Markdown Copied"
        );
    }
);