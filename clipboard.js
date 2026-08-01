// Clipboard Normalization
//
// Converts clipboard data from different spreadsheet
// applications (LibreOffice, Excel, Google Sheets, etc.)
// into a common internal representation.
//
// Developed by Andrés Riquelme
// Version 1.0.0 (Beta)
//
// ======================================================

"use strict";

// ======================================================
// Public API
// ======================================================

async function readClipboard()
{
    const rawText =
        await navigator.clipboard.readText();

    const lines =
        splitLines(rawText);

    const table =
        buildTable(lines);

    return {

        rawText: rawText,

        lines: lines,

        table: table

    };
}

// ======================================================
// Split Lines
// ======================================================

function splitLines(text)
{
    const lines =
        text.split(/\r?\n/);

    while (
        lines.length > 0 &&
        lines[lines.length - 1].trim() === ""
    )
    {
        lines.pop();
    }

    return lines;
}

// ======================================================
// Build Table
// ======================================================


function buildTable(lines)
{
    const table = [];

    for (const line of lines)
    {

    const cells =
    line
        .split("\t")
        .map(cell => cell.trim());


// LibreOffice Calc inserts empty tab-separated fields
// when copying non-contiguous columns (Ctrl + Click).
// Remove those empty cells so the resulting table has
// the expected one or two logical columns.


const normalized =
    cells.filter(cell => cell !== "");

table.push(normalized);
    }

    return table;
}
