// ======================================================
//
// Spreadsheet2Form
// Preview Module
//
// Firefox extension for safely transferring grades
// from spreadsheets to web-based grading systems.
//
// Developed by Andrés Riquelme
// Version 1.0.0 (Beta)
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

const STATUS_INFO = Object.freeze({

    [STATUS.UPDATE]: {
        className: "update",
        label: "Update"
    },

    [STATUS.SAME]: {
        className: "same",
        label: "No Change"
    },

    [STATUS.MISSING]: {
        className: "missing",
        label: "Missing"
    },

    [STATUS.DUPLICATE]: {
        className: "duplicate",
        label: "Duplicate"
    }

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

    modalMessage.innerHTML = message;

    modalOk.textContent = okText;

    modalCancel.textContent = cancelText;

    modalCancel.style.display =
        showCancel ? "" : "none";

    modalOverlay.classList.remove("hidden");

    requestAnimationFrame(() => modalOk.focus());

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
    await showModal({

        title: "Spreadsheet2Form",

        message: "No preview data is available.\n\nPlease return to the popup and perform a new comparison.",

        okText: "Close",

        showCancel: false

    });

    window.close();

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
// Render Summary Cards
// ======================================================

function renderSummary(data)
{
    const counts = {
        [STATUS.UPDATE]: 0,
        [STATUS.SAME]: 0,
        [STATUS.MISSING]: 0,
        [STATUS.DUPLICATE]: 0
    };

    for (const row of data)
    {
        if (counts[row.status] !== undefined)
        {
            counts[row.status]++;
        }
    }

    const elements = {

        [STATUS.UPDATE]:
            document.getElementById("updatesCount"),

        [STATUS.SAME]:
            document.getElementById("sameCount"),

        [STATUS.MISSING]:
            document.getElementById("missingCount"),

        [STATUS.DUPLICATE]:
            document.getElementById("duplicateCount")

    };

    for (const status in elements)
    {
        elements[status].textContent =
            counts[status];
    }
}

// ======================================================
// Render Preview Table
// ======================================================

function renderTable(data)
{
    const tbody =
        document.querySelector("#previewTable tbody");

    tbody.innerHTML = "";

    for (const row of data)
    {
        tbody.appendChild(
            createTableRow(row)
        );
    }
}

// ======================================================
// Create Table Row
// ======================================================

function createTableRow(row)
{
    const tr =
        document.createElement("tr");

    tr.className =
        row.status;

    tr.innerHTML = `

<td>${row.name ?? ""}</td>

<td>${row.id}</td>

<td>${row.current ?? ""}</td>

<td>${row.newValue}</td>

<td>${createStatusBadge(row.status)}</td>

`;

    return tr;
}

// ======================================================
// Create Status Badge
// ======================================================

function createStatusBadge(status)
{
    const info =
        STATUS_INFO[status];

    if (!info)
    {
        return "";
    }

    return `

<span class="statusBadge ${info.className}">
    ${info.label}
</span>

`;
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
            row => row.status === STATUS.UPDATE
        );

    if (updates.length === 0)
    {
        await showModal({

        title: "Nothing to Update",

        message:

        "No grade changes were detected.\n\nThe grading page already matches the spreadsheet.",

         okText: "Close",

         showCancel: false

    });
        return;
    }

    const confirmed =
    await showModal({

        title: "Confirm Grade Update",

        message:

`Update the grading page with the proposed changes?

<strong>${updates.length}</strong> grade(s) will be updated.

Spreadsheet2Form only updates grade fields.

No grades will be submitted automatically.

You must still use the grading page's own Submit button.`,

        okText: "Update",

        cancelText: "Cancel",

        showCancel: true

    });

if (!confirmed)
{
    return;
}

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

await showModal({

    title: "Update Completed",

    message:

`Spreadsheet2Form has finished updating the grading page.<br>

Updated grades: <strong>${result.updated}</strong><br>

The modified fields have been highlighted in pale yellow.<br>

Review the changes before using the grading page's Submit button.`,

    okText: "Close",

    showCancel: false

});

    window.close();
}
