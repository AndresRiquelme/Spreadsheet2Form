# Spreadsheet2Form

<p align="center">

<img src="images/logo.png" alt="Spreadsheet2Form Logo" width="180">

</p>

<p align="center">

**A Firefox extension for safely transferring grade data from spreadsheets to web forms.**

</p>

---

# Overview

Spreadsheet2Form is an open-source Firefox extension designed to help instructors transfer grade data from spreadsheets into web-based grading systems in a **safe, controlled, and verifiable** manner.

Unlike simple automation tools that blindly simulate keyboard input, Spreadsheet2Form validates clipboard contents, compares spreadsheet data with the destination webpage, and presents a preview of all proposed changes before any modification is applied.

The primary goal of the project is **data integrity**, reducing transcription errors while simplifying repetitive grading tasks.

---

# Why Spreadsheet2Form?

Entering grades manually into a web form is a repetitive task that is both time-consuming and error-prone.

Spreadsheet2Form was created to make this process safer by introducing multiple verification steps before any grade is transferred.

The extension never writes data directly from the clipboard into the webpage without first validating the copied information and presenting a comparison preview.

---

# Key Features

* Clipboard validation before processing.
* Automatic spreadsheet header detection.
* Supports one-column (sequential) grade imports.
* Supports two-column (Student ID + Grade) imports.
* Detects duplicate student identifiers.
* Detects invalid clipboard selections.
* Compares spreadsheet data with the destination webpage.
* Preview of every proposed modification.
* Modern Firefox WebExtension architecture.
* Modular source code designed for future expansion.

---

# How Spreadsheet2Form Works

```text
Spreadsheet
      │
      ▼
Clipboard
      │
      ▼
Clipboard Validation
      │
      ▼
Comparison with Webpage
      │
      ▼
Preview
      │
      ▼
Apply Changes
```

Every transfer passes through this pipeline before any modification is made to the webpage.

---

## Installation

Until the extension is published through the Firefox Add-ons website,
Spreadsheet2Form can be installed temporarily for development and testing.

1. Clone or download this repository.
2. Open Firefox.
3. Navigate to `about:debugging`.
4. Select **This Firefox**.
5. Click **Load Temporary Add-on...**
6. Select the project's `manifest.json` file.
7. The extension will appear in the Firefox toolbar.

---

# Usage

## Sequential Mode

Copy a single spreadsheet column containing grades.

Spreadsheet2Form transfers grades sequentially into the destination webpage.

---

## Student ID Mode

Copy two columns:

* Student ID
* Grade

Spreadsheet2Form matches every student identifier found on the webpage before proposing any modification.

---

## Preview

Before applying any change, Spreadsheet2Form displays a preview showing:

* Current value
* New value
* Student identifier
* Update status

The preview allows users to verify every proposed modification before continuing.

---

# Current Compatibility

Version **1.0** has been designed and tested using a single university grading system.

Although the internal architecture is modular and intended to support multiple institutions, **Version 1.0 officially supports only the grading webpage used by the author's institution**.

Support for additional grading systems is planned through configurable institution profiles in future releases.

---

# Project Architecture

The project has been organized into independent modules.

| Module        | Purpose                                     |
| ------------- | ------------------------------------------- |
| clipboard.js  | Reads and parses clipboard contents         |
| validation.js | Validates clipboard structure and data      |
| compare.js    | Compares spreadsheet data with webpage data |
| content.js    | Reads grading information from the webpage  |
| preview.js    | Builds the comparison preview               |
| message.js    | Displays user messages inside the popup     |
| popup.js      | Coordinates the extension workflow          |

This modular design simplifies maintenance and future feature development.

---

## Project Philosophy

Spreadsheet2Form was created to help educators reduce errors when transferring grade data from spreadsheets into institutional web grading systems.

The project is released as free software under the GNU General Public License v3 (GPL v3) to ensure that it remains freely available to educators, students, and institutions.

Contributions and adaptations are encouraged. The long-term vision is to support multiple educational institutions through a modular and extensible architecture while ensuring that future improvements remain available to the entire community.

# Roadmap

## Version 1.0

* Clipboard validation
* Header detection
* Sequential mode
* Student ID mode
* Preview before applying changes
* Message component
* Modular architecture

## Version 1.1 (planned)

* Institution profiles
* User preferences
* Support for additional university grading systems
* Configurable webpage selectors
* Improved reporting
* Additional validation rules

---

# Disclaimer

Spreadsheet2Form is an independent open-source project developed by **Andrés Riquelme**.

This extension is **not affiliated with, endorsed by, sponsored by, or supported by any university or educational institution**.

Users are responsible for verifying all grades before submitting them through their institution's official grading system. Spreadsheet2Form provides validation and preview mechanisms designed to reduce human error but does not replace the user's responsibility for reviewing submitted information.

---

# Contributing

Contributions, bug reports, feature requests, and suggestions are welcome.

Please use the GitHub Issues page to report problems or propose improvements.

---

## License

Spreadsheet2Form is released under the **GNU General Public License v3.0 (GPL v3)**.

You are free to use, study, modify, and redistribute this software under the terms of the GNU GPL v3.

The project is intended to remain **free software** so that educators, students, and institutions may benefit from it while ensuring that future improvements remain available to the community.

For the complete license text, see the accompanying **LICENSE** file.

---

# Author

**Andrés Riquelme**

Open-source educational software developer.

