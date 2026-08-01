// ======================================================
//
// Spreadsheet2Form
// Validation Module
//
// Validates clipboard data before comparison.
//
// Developed by Andrés Riquelme
// Version 1.0.0
//
// ======================================================

"use strict";

// ======================================================
// Constants
// ======================================================

const MODE = Object.freeze({

    SEQUENTIAL: "sequential",

    ID: "id"

});

const HEADER_WORDS = Object.freeze([

    // ID column

    "id",
    "student id",
    "studentid",
    "identifier",
    "rut",
    "code",
    "codigo",
    "código",

    // Grade column

    "grade",
    "grades",
    "score",
    "scores",
    "mark",
    "marks",
    "nota",
    "notas",
    "calificacion",
    "calificación"

]);

// ======================================================
// Public API
// ======================================================

function validateClipboard(table)
{
    const report =
        createValidationReport(table);

    if (!validateNotEmpty(report))
        return report;

    report.hasHeader =
        detectHeader(report.table);

    if (report.hasHeader)
    {
        removeHeader(report);
    }

    if (!validateColumnCount(report))
        return report;

    if (!validateRectangularTable(report))
        return report;

    detectMode(report);

    normalizeRows(report);

    if (!validateGrades(report))
        return report;

    if (!validateIds(report))
        return report;

    return finalizeValidation(report);
}

// ======================================================
// Report Factory
// ======================================================

function createValidationReport(table)
{
    return {

        valid: true,

        mode: null,

        hasHeader: false,

        table: table,

        rows: [],

        errors: [],

        warnings: [],

        statistics: {

            originalRows: table.length,

            dataRows: table.length,

            columns: 0

        }

    };
}

// ======================================================
// Basic Validation
// ======================================================

function validateNotEmpty(report)
{
    if (report.table.length === 0)
    {
        report.valid = false;

        report.errors.push(
            "Clipboard is empty."
        );

        return false;
    }

    return true;
}

// ======================================================
// Header Detection
// ======================================================

function detectHeader(table)
{
    const firstRow =
        table[0];

    let matches = 0;

    for (const cell of firstRow)
    {
        const value =
            normalizeText(cell);

        if (HEADER_WORDS.includes(value))
        {
            matches++;
        }
    }

    return matches > 0;
}

// ======================================================
// Remove Header
// ======================================================

function removeHeader(report)
{
    report.table =
        report.table.slice(1);

    report.statistics.dataRows =
        report.table.length;
}

// ======================================================
// Utilities
// ======================================================

function normalizeText(text)
{
    return String(text)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// ======================================================
// Column Validation
// ======================================================

function validateColumnCount(report)
{
    if (report.table.length === 0)
    {
        report.valid = false;

        report.errors.push(
            "No data rows were found."
        );

        return false;
    }

    const columns =
        report.table[0].length;

    report.statistics.columns =
        columns;

    if (columns < 1)
    {
        report.valid = false;

        report.errors.push(
            "No columns were detected."
        );

        return false;
    }

    if (columns > 2)
    {
        report.valid = false;

        report.errors.push(

            "Spreadsheet2Form supports only one or two copied columns.\n\n" +

            columns +

            " columns were detected."

        );

        return false;
    }

    return true;
}
// ======================================================
// Table Shape Validation
// ======================================================

function validateRectangularTable(report)
{
    const expectedColumns =
        report.statistics.columns;

    for (let row = 0; row < report.table.length; row++)
    {
        const actualColumns =
            report.table[row].length;

        if (actualColumns !== expectedColumns)
        {
            report.valid = false;

            report.errors.push(

                "Row " +

                (row + 1) +

                " contains " +

                actualColumns +

                " column(s), but " +

                expectedColumns +

                " were expected."

            );

            return false;
        }
    }

    return true;
}

// ======================================================
// Mode Detection
// ======================================================

function detectMode(report)
{
    if (report.statistics.columns === 1)
    {
        report.mode =
            MODE.SEQUENTIAL;
    }
    else
    {
        report.mode =
            MODE.ID;
    }

    return true;
}

// ======================================================
// Normalize Rows
// ======================================================

function normalizeRows(report)
{
    report.rows = [];

    if (report.mode === MODE.SEQUENTIAL)
    {
        for (const row of report.table)
        {
            report.rows.push({

                score:
                    row[0]

            });
        }

        return true;
    }

    for (const row of report.table)
    {
        report.rows.push({

            id:
                row[0],

            score:
                row[1]

        });
    }

    return true;
}

// ======================================================
// Grade Validation
// ======================================================

function validateGrades(report)
{
    for (let i = 0; i < report.rows.length; i++)
    {
        const row = report.rows[i];

        let grade =
            row.score
                .trim()
                .replace(",", ".");

        if (grade === "")
        {
            report.valid = false;

            report.errors.push(

                "Empty grade found at row " +

                (i + 1) + "."

            );

            return false;
        }

        if (isNaN(Number(grade)))
        {
            report.valid = false;

            report.errors.push(

                "Invalid grade \"" +

                row.score +

                "\" at row " +

                (i + 1) + "."

            );

            return false;
        }

        row.score = grade;
    }

    return true;
}

// ======================================================
// ID Validation
// ======================================================

function validateIds(report)
{
    if (report.mode !== MODE.ID)
    {
        return true;
    }

    const ids =
        new Set();

    for (let i = 0; i < report.rows.length; i++)
    {
        const row =
            report.rows[i];

        const id =
            row.id.trim();

        if (id === "")
        {
            report.valid = false;

            report.errors.push(

                "Empty ID found at row " +

                (i + 1) + "."

            );

            return false;
        }

        if (ids.has(id))
        {
            report.warnings.push(

                "Duplicate ID detected: " +

                id

            );
        }

        ids.add(id);

        row.id = id;
    }

    return true;
}

// ======================================================
// Final Statistics
// ======================================================

function buildStatistics(report)
{
    report.statistics.validRows =
        report.rows.length;

    report.statistics.warningCount =
        report.warnings.length;

    report.statistics.errorCount =
        report.errors.length;
}

// ======================================================
// Finalize Validation
// ======================================================

function finalizeValidation(report)
{
    buildStatistics(report);

    report.valid =
        report.errors.length === 0;

    return report;
}
