# Changelog

All notable changes to **Spreadsheet2Form** will be documented in this file.

The project follows the principles of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and uses Semantic Versioning.

---

## [1.0.0] - 2026-07-30

### Added

* Initial public release of Spreadsheet2Form.
* Firefox WebExtension architecture.
* Support for sequential grade transfer (single-column mode).
* Support for Student ID + Grade transfer (two-column mode).
* Clipboard validation before processing.
* Automatic spreadsheet header detection.
* Clipboard normalization for contiguous and non-contiguous spreadsheet selections.
* Detection of invalid clipboard selections.
* Detection of duplicate Student IDs.
* Comparison engine between spreadsheet data and webpage data.
* Preview window displaying all proposed modifications before applying changes.
* Message component replacing browser alert dialogs.
* Modular project architecture.
* Project documentation (`README.md`).
* GNU General Public License v3.0 (`LICENSE`).

### Security

* Added multiple validation steps before modifying webpage contents.
* Prevented unsupported clipboard formats from being processed.
* Introduced preview confirmation before applying changes.

### Notes

Version 1.0 officially supports the grading webpage used by the author's institution.

Support for additional institutions is planned through configurable institution profiles in future releases.
