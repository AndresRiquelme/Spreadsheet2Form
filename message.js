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

    box.className = "message";

    const icon =
        document.getElementById("messageIcon");

switch (type)
{
    case "error":

        box.classList.add("messageError");

        icon.textContent = "❌";

        break;

    case "warning":

        box.classList.add("messageWarning");

        icon.textContent = "⚠";

        break;

    case "success":

        box.classList.add("messageSuccess");

        icon.textContent = "✅";

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
