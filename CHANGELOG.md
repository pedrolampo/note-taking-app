# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2024-08-03

### Added

- Sidebar with a note list on the Note view
  - SideBar component shows a list of Tags sorted alphabetically
  - Every tag is an Accordion component containing every Note related to the Tag
  - NOTE: Sidebar is not supported in mobile for UX purposes
- Create new CSS files for Note and NoteForm components
- Started development of private notes for each user (WIP)
  - You can now set notes to Private, but it will only be a visual change (Private badge)
  - Private notes will only be available for the owner of the Note

### Updated

- Header and NoteForm view in mobile UI

### Fixed

- Fixed lightmode issues on some components

### Removed

- Tasks (just hidden, not fully removed)

## [1.2.2] - 2023-10-19

### Added

- Table of Contents toggle to NoteForm

### Security

- Improved user and app's security

## [1.2.1] - 2023-09-15

### Added

- MIT License

### Changed

- CSS files refactored

## [1.2.0] - 2023-08-25

### Changed

- Mobile UI improved
  - Added mediaqueries
  - Better use of bootstrap classes

## [1.1.4] - 2023-08-23

### Removed

- Reverted 2023-08-17 commit

## [1.1.3] - 2023-08-17

### Security

- Encoded user data

## [1.1.2] - 2023-08-10

### Added

- Commented code for better readability

### Fixed

- Tasks default status

## [1.1.1] - 2023-08-03

### Added

- Ability to sort tasks in the tasks table

## [1.1.0] - 2023-08-01

### Added

- Tasks
  - Tasks can now be created in it's own path
  - Tasks are personal, they are not public

## [1.0.8] - 2023-07-05

### Added

- Lightmode option

## [1.0.7] - 2023-07-04

### Added

- Toggle to activate Note overview

## [1.0.6] - 2023-06-21

### Added

- User ID to user document in the DB
- `searchUsers` function
  - Returns user from DB
- Badge with note's owner

## [1.0.5] - 2023-06-04

### Added

- Firebase log in functionality
- User Context
- `getPowerUser` function
  - Returns all powerusers

## [1.0.4] - 2023-05-31

### Added

- Table of Contents to Notes
  - `TableOfContents` component
  - `slugify` and `extractHeadings` functions
- Private Notes

## [1.0.3] - 2022-12-22

### Added

- `ScrollToTop` component and functionality

## [1.0.2] - 2022-12-20

### Added

- Tables inside the markdown
- Notes are now sorted alphabetically in the home page

## [1.0.1] - 2022-12-20

### Added

- Tables inside the markdown
- Notes are now sorted alphabetically in the home page

## [1.0.0] - 2022-11-18

### Added

- Better navigation
- .env
  - Contains firebase secrets
- Delete note modal
  - Delete password added to DB

### Changed

- .gitignore

## [0.1.0] - 2022-11-16

### Added

- First commit
- Firebase integration

### Changed

- Bunch of UI/UX fixes
