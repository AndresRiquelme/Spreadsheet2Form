// ======================================================
//
// Spreadsheet2Form
// Popup Controller
//
// Developed by Andrés Riquelme
// Version 1.0 (Beta)
//
// ======================================================

"use strict";

console.log("Spreadsheet2Form Popup loaded");

document
    .getElementById("fill")
    .addEventListener(
        "click",
        startPreview
    );

// ======================================================
// Start Preview
// ======================================================

async function startPreview()
{
    try
    {
        // --------------------------------------------------
        // Active tab
        // --------------------------------------------------

        const [tab] =
            await browser.tabs.query({

                active: true,
                currentWindow: true

            });

        if (!tab)
        {
            throw new Error(
                "No active tab found."
            );
        }

        // --------------------------------------------------
        // Read grading page
        // --------------------------------------------------

        const pageData =
            await browser.tabs.sendMessage(

                tab.id,

                {
                    action: "readPage"
                }

            );

        // --------------------------------------------------
        // Read clipboard
        // --------------------------------------------------

        const clipboardData =
            await readClipboard();

        // --------------------------------------------------
        // Validate clipboard
        // --------------------------------------------------

        const validation =
            validateClipboard(
                clipboardData.table
            );
console.log("VALIDATION");
console.log(validation);
console.log("Clipboard table:", clipboardData.table);
        if (!validation.valid)
        {
            alert(

                "Clipboard validation failed.\n\n" +

                validation.errors.join("\n")

            );

            return;
        }

        // --------------------------------------------------
        // Compare
        // --------------------------------------------------

        const comparison =
            compareGrades(

                validation.rows,

                pageData

            );

        // --------------------------------------------------
        // Store preview data
        // --------------------------------------------------

        await browser.storage.local.set({

            previewData: {

                mode:
                    validation.mode,

                hasHeader:
                    validation.hasHeader,

                clipboardRows:
                    validation.statistics.dataRows,

                pageRows:
                    pageData.length,

                validation:

                    validation,

                sourceTabId:
                    tab.id,

                comparison:
                    comparison

            }

        });

        // --------------------------------------------------
        // Open preview
        // --------------------------------------------------

        await browser.tabs.create({

            url:
                browser.runtime.getURL(
                    "preview.html"
                )

        });

        window.close();
    }
    catch (err)
    {
        console.error(err);

        alert(

    "Spreadsheet2Form\n\n" +

    err.message +

    "\n\nSee Browser Console (Ctrl+Shift+J) for details."

);
    }
}
