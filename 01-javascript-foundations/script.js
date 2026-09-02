const researchInput =
    document.getElementById("researchQuery");

const searchButton =
    document.getElementById("researchButton");

const statusDisplay =
    document.getElementById("statusDisplay");

const reportDisplay =
    document.getElementById("report");

const downloadArea =
    document.getElementById("downloadArea");


// ==========================================
// RESEARCH BUTTON
// ==========================================

searchButton.addEventListener(
    "click",
    async function () {

        const userText =
            researchInput.value.trim();


        // ==========================================
        // VALIDATE INPUT
        // ==========================================

        if (!userText) {

            statusDisplay.textContent =
                "Please enter a research topic.";

            return;

        }


        console.log(
            "Research Query:",
            userText
        );


        // ==========================================
        // UPDATE UI
        // ==========================================

        statusDisplay.textContent =
            "🔎 Searching the web...";


        reportDisplay.innerHTML = "";

        downloadArea.innerHTML = "";


        // Disable button while researching
        searchButton.disabled = true;


        try {


            // ==========================================
            // SEND REQUEST TO BACKEND
            // ==========================================

            const response = await fetch(
                "http://localhost:3000/api/research",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        topic: userText
                    })

                }
            );


            // Convert response into JavaScript object
            const data = await response.json();


            console.log(
                "Backend Response:",
                data
            );


            // ==========================================
            // HANDLE BACKEND ERROR
            // ==========================================

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    data.message ||
                    "Research failed."
                );

            }


            // ==========================================
            // RESEARCH COMPLETED
            // ==========================================

            statusDisplay.textContent =
                "✅ Research completed";


            // ==========================================
            // DISPLAY REPORT
            // ==========================================

            const reportBox =
                document.createElement("div");


            reportBox.className =
                "report-box";


            // textContent keeps AI output as text
            // instead of executing it as HTML
            reportBox.textContent =
                data.message;


            reportDisplay.appendChild(
                reportBox
            );


            // ==========================================
            // DISPLAY SOURCES
            // ==========================================

            const sourcesContainer =
                document.createElement("div");


            sourcesContainer.className =
                "sources";


            const heading =
                document.createElement("h2");


            heading.textContent =
                "📚 Sources";


            sourcesContainer.appendChild(
                heading
            );


            data.sources.forEach(
                function (source) {


                    const sourceDiv =
                        document.createElement("div");


                    sourceDiv.className =
                        "source";


                    const link =
                        document.createElement("a");


                    link.href =
                        source.url;


                    link.target =
                        "_blank";


                    link.rel =
                        "noopener noreferrer";


                    link.textContent =
                        `${source.id}. ${source.title}`;


                    sourceDiv.appendChild(
                        link
                    );


                    sourcesContainer.appendChild(
                        sourceDiv
                    );

                }
            );


            reportDisplay.appendChild(
                sourcesContainer
            );


            // ==========================================
            // OBSIDIAN DOWNLOAD BUTTON
            // ==========================================

            const downloadButton =
                document.createElement("a");


            downloadButton.className =
                "download-button";


            downloadButton.textContent =
                "📝 Download Obsidian Note";


            downloadButton.href =
                `http://localhost:3000/research-output/${data.note.filename}`;


            downloadButton.download =
                data.note.filename;


            downloadButton.target =
                "_blank";


            downloadArea.appendChild(
                downloadButton
            );


        } catch (error) {


            // ==========================================
            // ERROR HANDLING
            // ==========================================

            console.error(
                "Research error:",
                error
            );


            statusDisplay.textContent =
                "❌ Research failed";


            reportDisplay.textContent =
                error.message;


        } finally {


            // Enable button again
            searchButton.disabled = false;

        }

    }
);