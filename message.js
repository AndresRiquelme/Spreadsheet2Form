"use strict";

// ======================================================
// Message Component
//
// Developed by Andrés Riquelme
// ======================================================

function showMessage(type, title, text)
{
    const main =
        document.getElementById("mainContent");

    const box =
        document.getElementById("messageBox");

    if (main)
    {
        main.style.display = "none";
    }

// Reset message style before applying
// the current message type.

    box.className = "message";

    const icon =
        document.getElementById("messageIcon");

const ICON = Object.freeze({

    ERROR: "\u274C",

    WARNING: "\u26A0",

    SUCCESS: "\u2705"

});


switch (type)
{
    case "error":

        box.classList.add("messageError");

        icon.textContent = ICON.ERROR;

        break;

    case "warning":

        box.classList.add("messageWarning");

        icon.textContent = ICON.WARNING;

        break;

    case "success":
    // Reserved for future workflows
    // (e.g. successful grade update).
        box.classList.add("messageSuccess");

        icon.textContent = ICON.SUCCESS;

        break;
}

    document.getElementById("messageTitle").textContent =
        title;

    document.getElementById("messageText").textContent =
        text;

    box.classList.remove("hidden");
}

function hideMessage()
{
    window.close();
}

document.addEventListener(
    "DOMContentLoaded",
    () =>
    {
        document
            .getElementById("messageClose")
            .addEventListener(
                "click",
                hideMessage
            );
    }
);
