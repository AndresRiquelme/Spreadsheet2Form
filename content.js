// ======================================================
// Spreadsheet2Form - content.js
// ======================================================
"use strict";

// ======================================================
// Read grades from the grading page
// ======================================================

function readGradesFromPage()
{
    const records = [];

    const inputs = document.querySelectorAll(
        'input[name="p_values"]'
    );

    inputs.forEach((input, index) => {

        const row = input.closest("tr");

        if (!row)
            return;

        const cells = row.querySelectorAll("td");

        // Expected columns:
        //
        // 0 -> Row number
        // 1 -> Student ID
        // 2 -> Student name
        // 3 -> Grade input
        //
        if (cells.length < 4)
            return;

        const id =
            cells[1].textContent.trim();

        const name =
            cells[2].textContent.trim();

        records.push({

            pageRow: index + 1,

            inputIndex: index,

            id: id,

            name: name,

            current: input.value

        });

    });

    return records;
}



// ======================================================
// Apply grades to the webpage
// ======================================================

function applyGrades(comparison)
{
    const inputs = document.querySelectorAll(
        'input[name="p_values"]'
    );

    let updated = 0;

    comparison.forEach(row => {

        if (row.status !== "update")
            return;

        const input =
            inputs[row.inputIndex];

        if (!input)
            return;

        // Update value only

        input.value = row.newValue;

        // Highlight updated value

        input.style.backgroundColor = "#fff3cd";
        input.style.border = "2px solid #d6b656";

        updated++;

    });

    return updated;
}

// ======================================================
// Message handler
// ======================================================

browser.runtime.onMessage.addListener((message) => {

    switch (message.action)
    {

        case "readPage":

            const pageData =
                readGradesFromPage();

            return Promise.resolve(pageData);


        case "applyGrades":

            const updated =
                applyGrades(message.data);

            return Promise.resolve({

                updated: updated

            });

    }

});
