// ======================================================
//
// Spreadsheet2Form
// Preview Module
//
// Firefox extension for safely transferring grades
// from spreadsheets to web-based grading systems.
//
// Developed by Andrés Riquelme
// Version 1.0 (Beta)
//
// ======================================================

"use strict";

console.log("Spreadsheet2Form Preview loaded");

// ======================================================
// Constants
// ======================================================

const STATUS = Object.freeze({

    UPDATE: "update",
    SAME: "same",
    MISSING: "missing",
    DUPLICATE: "duplicate"

});

const MODE = Object.freeze({

    ID: "id",
    SEQUENTIAL: "sequential"

});

// ======================================================
// Global State
// ======================================================

let previewData = null;

// ======================================================
// Modal Dialog
// ======================================================

let modalResolve = null;

const modalOverlay =
    document.getElementById("modalOverlay");

const modalTitle =
    document.getElementById("modalTitle");

const modalMessage =
    document.getElementById("modalMessage");

const modalOk =
    document.getElementById("modalOk");

const modalCancel =
    document.getElementById("modalCancel");

// ======================================================
// Modal Dialog
// ======================================================

function showModal({
    title = "Spreadsheet2Form",
    message = "",
    okText = "OK",
    cancelText = "Cancel",
    showCancel = true
})
{
    modalTitle.textContent = title;

    modalMessage.textContent = message;

    modalOk.textContent = okText;

    modalCancel.textContent = cancelText;

    modalCancel.style.display =
        showCancel ? "" : "none";

    modalOverlay.classList.remove("hidden");

    modalOk.focus();

    return new Promise(resolve => {

        modalResolve = resolve;

    });
}


function hideModal(result)
{
    modalOverlay.classList.add("hidden");

    if (modalResolve)
    {
        modalResolve(result);
        modalResolve = null;
    }
}

modalOk.addEventListener(
    "click",
    () => hideModal(true)
);

modalCancel.addEventListener(
    "click",
    () => hideModal(false)
);

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

    if (mode === MODE.ID)
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
            case STATUS.UPDATE:
                updates++;
                break;

            case STATUS.SAME:
                same++;
                break;

            case STATUS.MISSING:
                missing++;
                break;

            case STATUS.DUPLICATE:
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
            case STATUS.UPDATE:
                badge =
                    "<span class='statusBadge update'>Update</span>";
                break;

            case STATUS.SAME:
                badge =
                    "<span class='statusBadge same'>Correct</span>";
                break;

            case STATUS.MISSING:
                badge =
                    "<span class='statusBadge missing'>Missing</span>";
                break;

            case STATUS.DUPLICATE:
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
            row => row.status === STATUS.DUPLICATE
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
