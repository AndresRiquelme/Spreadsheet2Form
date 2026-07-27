// ======================================================
// Spreadsheet2Form - compare.js
// ======================================================
//
// Compares spreadsheet data with the grading webpage.
//
// Supports:
//
//   1. Matching by Student ID
//   2. Sequential matching (no IDs)
//
// Returns a comparison array suitable for preview.js.
//

function compareGrades(calcData, pageData)
{
    // If the spreadsheet has no IDs, compare sequentially.
    if (
        calcData.length > 0 &&
        !calcData[0].id
    )
    {
        return compareSequential(
            calcData,
            pageData
        );
    }

    const result = [];

    // --------------------------------------------------
    // Detect duplicate IDs in the spreadsheet
    // --------------------------------------------------

    const seen = new Set();

    for (const grade of calcData)
    {
        if (seen.has(grade.id))
        {
            result.push({

                pageRow: null,

                inputIndex: null,

                id: grade.id,

                name: "",

                current: "",

                newValue: grade.score,

                status: "duplicate"

            });

            continue;
        }

        seen.add(grade.id);
    }

    // --------------------------------------------------
    // Build webpage lookup table
    // --------------------------------------------------

    const pageMap = new Map();

    for (const student of pageData)
    {
        pageMap.set(
            student.id,
            student
        );
    }

    // --------------------------------------------------
    // Compare spreadsheet with webpage
    // --------------------------------------------------

    for (const grade of calcData)
    {
        const student =
            pageMap.get(grade.id);

        if (!student)
        {
            result.push({

                pageRow: null,

                inputIndex: null,

                id: grade.id,

                name: "",

                current: "",

                newValue: grade.score,

                status: "missing"

            });

            continue;
        }

        const status =
            String(student.current).trim()
            ===
            String(grade.score).trim()
            ?
            "same"
            :
            "update";

        result.push({

            pageRow: student.pageRow,

            inputIndex: student.inputIndex,

            id: student.id,

            name: student.name,

            current: student.current,

            newValue: grade.score,

            status: status

        });

    }

    return result;
}



// ======================================================
// Sequential comparison
// ======================================================

function compareSequential(calcData, pageData)
{
    const result = [];

    for (
        let i = 0;
        i < calcData.length;
        i++
    )
    {

        if (i >= pageData.length)
        {
            result.push({

                pageRow: null,

                inputIndex: null,

                id: "(row " + (i + 1) + ")",

                name: "",

                current: "",

                newValue: calcData[i].score,

                status: "missing"

            });

            continue;
        }

        const student =
            pageData[i];

        const status =
            String(student.current).trim()
            ===
            String(calcData[i].score).trim()
            ?
            "same"
            :
            "update";

        result.push({

            pageRow: student.pageRow,

            inputIndex: student.inputIndex,

            id: student.id,

            name: student.name,

            current: student.current,

            newValue: calcData[i].score,

            status: status

        });

    }

    return result;
}
