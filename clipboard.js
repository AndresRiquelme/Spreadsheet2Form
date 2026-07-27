// clipboard.js
//
// Reads the clipboard and converts it into a JavaScript object.
//
// Supported formats:
//
// 1 column:
//
//      5.5
//      6.0
//      4.8
//
// becomes
//
//      mode = "sequential"
//
//      [
//          {score:"5.5"},
//          {score:"6.0"},
//          {score:"4.8"}
//      ]
//
// ------------------------------------
//
// 2 columns:
//
//      YYYYICO001<TAB>5.5
//      YYYYICO002<TAB>6.0
//
// becomes
//
//      mode = "id"
//
//      [
//          {id:"YYYYICO001",score:"5.5"},
//          {id:"YYYYICO002",score:"6.0"}
//      ]

async function readClipboard()
{
    const text = await navigator.clipboard.readText();

    let lines = text.split(/\r?\n/);

    // Remove trailing blank lines
    while (lines.length && lines[lines.length-1].trim() === "")
        lines.pop();

    let result = [];

    let mode = null;

    for (const line of lines)
    {
        const cols = line.split("\t");

        if (cols.length == 1)
        {
            mode = "sequential";

            result.push({
                score: cols[0].trim()
            });
        }
        else
        {
            mode = "id";

            result.push({
                id: cols[0].trim(),
                score: cols[cols.length-1].trim()
            });
        }
    }

    return {
        mode: mode,
        rows: result
    };
}
