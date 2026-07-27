// popup.js
console.log("POPUP JS VERSION TEST");
document.getElementById("fill").addEventListener("click", async () => {

    try {

        // Get the active browser tab (the grading page)
        const [tab] = await browser.tabs.query({
            active: true,
            currentWindow: true
        });

        if (!tab) {
            throw new Error("No active tab found.");
        }

        // Read the students currently displayed on the webpage
        const pageData = await browser.tabs.sendMessage(
            tab.id,
            {
                action: "readPage"
            }
        );

        // Read and parse the clipboard
        const clipboardData = await readClipboard();

        // Compare clipboard with webpage
        const comparison = compareGrades(
            clipboardData.rows,
            pageData
        );

        // Store everything needed by the preview page
        await browser.storage.local.set({

            previewData: {

                mode: clipboardData.mode,

                clipboardRows: clipboardData.rows.length,

                pageRows: pageData.length,

                sourceTabId: tab.id,

                comparison: comparison

            }

        });

        // Open the preview page in a new tab
        await browser.tabs.create({

            url: browser.runtime.getURL("preview.html")

        });

        // Close the popup (optional, but makes the UX cleaner)
        window.close();

    }
    catch (err) {

        console.error("Calc2Form:", err);

        alert(
            "Error:\n\n" + err.message
        );

    }

});
