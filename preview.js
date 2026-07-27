// ======================================================
// Spreadsheet2Form - preview.js
// ======================================================

console.log("Spreadsheet2Form Preview loaded");

let previewData = null;

// ======================================================
// Initialization
// ======================================================

document.addEventListener("DOMContentLoaded", initialize);

async function initialize()
{
    renderVersion();

    const stored =
        await browser.storage.local.get("previewData");

    if (!stored.previewData)
    {
        alert("No preview data available.");
        return;
    }

    previewData = stored.previewData;

    renderMode(
        previewData.mode,
        previewData.clipboardRows,
        previewData.pageRows
    );

    renderSummary(
        previewData.comparison
    );

    renderTable(
        previewData.comparison
    );

    document
        .getElementById("apply")
        .addEventListener(
            "click",
            applyChanges
        );

    document
        .getElementById("cancel")
        .addEventListener(
            "click",
            () => window.close()
        );
}



// ======================================================
// Version
// ======================================================

function renderVersion()
{
    const manifest =
        browser.runtime.getManifest();

    const version =
        "Version " +
        manifest.version +
        " (Beta)";

    document.getElementById(
        "version"
    ).textContent = version;

    document.getElementById(
        "footerVersion"
    ).textContent = version;
}



// ======================================================
// Mode
// ======================================================

function renderMode(
    mode,
    clipboardRows,
    pageRows
)
{
    const box =
        document.getElementById("modeBox");

    if (mode === "id")
    {
        box.innerHTML = `

<h3>🆔 Matching by Student ID</h3>

<p>

Student IDs detected in the spreadsheet.

Each grade will be matched with the corresponding
student before updating the grading page.

</p>

`;
    }
    else
    {
        box.innerHTML = `

<h3>🔢 Sequential Mode</h3>

<p>

No student IDs were detected.

Grades will be assigned in row order.

<br><br>

Spreadsheet rows:
<b>${clipboardRows}</b>

&nbsp;&nbsp;&nbsp;

Webpage rows:
<b>${pageRows}</b>

</p>

`;
    }
}



// ======================================================
// Summary Cards
// ======================================================

function renderSummary(data)
{
    let updates = 0;
    let same = 0;
    let missing = 0;
    let duplicate = 0;

    data.forEach(row => {

        switch (row.status)
        {
            case "update":
                updates++;
                break;

            case "same":
                same++;
                break;

            case "missing":
                missing++;
                break;

            case "duplicate":
                duplicate++;
                break;
        }

    });

    document.getElementById("updatesCount").textContent =
        updates;

    document.getElementById("sameCount").textContent =
        same;

    document.getElementById("missingCount").textContent =
        missing;

    document.getElementById("duplicateCount").textContent =
        duplicate;
}



// ======================================================
// Preview Table
// ======================================================

function renderTable(data)
{
    const tbody =
        document.querySelector(
            "#previewTable tbody"
        );

    tbody.innerHTML = "";

    data.forEach(row => {

        const tr =
            document.createElement("tr");

        tr.className =
            row.status;

        let badge = "";

        switch (row.status)
        {
            case "update":
                badge =
                    "<span class='statusBadge update'>Update</span>";
                break;

            case "same":
                badge =
                    "<span class='statusBadge same'>Correct</span>";
                break;

            case "missing":
                badge =
                    "<span class='statusBadge missing'>Missing</span>";
                break;

            case "duplicate":
                badge =
                    "<span class='statusBadge duplicate'>Duplicate</span>";
                break;
        }

        tr.innerHTML = `

<td>${row.name ?? ""}</td>

<td>${row.id}</td>

<td>${row.current ?? ""}</td>

<td>${row.newValue}</td>

<td>${badge}</td>

`;

        tbody.appendChild(tr);

    });

}



// ======================================================
// Apply
// ======================================================

async function applyChanges()
{
    const comparison =
        previewData.comparison;

    const updates =
        comparison.filter(
            row => row.status === "update"
        );

    if (updates.length === 0)
    {
        alert(
            "There are no grades to update."
        );
        return;
    }

    const confirmed = confirm(

`Update the grading page with the proposed changes?

${updates.length} grade(s) will be updated.

Spreadsheet2Form only updates the grade fields.
No grades will be submitted.

You must still use the grading page's own Submit button to finalize the grades.`

    );

    if (!confirmed)
        return;

    const result =
        await browser.tabs.sendMessage(

            previewData.sourceTabId,

            {
                action: "applyGrades",
                data: comparison
            }

        );

    alert(

`Spreadsheet2Form has finished updating the grading page.

Updated grades: ${result.updated}

The modified fields have been highlighted in pale yellow.

Review the changes on the grading page before using its Submit button.`

    );

    window.close();
}
