# Devember 2025 - Obsidian plugin

This repository represents my entry into [Devember](https://devember.org/) 2025
and is an [Obsidian](https://obsidian.md/) plugin. The ultimate goal, which may
or may not be inside the bounds of this Devember project, is a plugin that is
dedicated to the tooling and support required to help course creators on sites
such as YouTube or Udemy to build and structure course materials, tracking the
course as a whole, what is complete, what is missing etc.

The initial stages of this are going to revolve around reviewing the
[API documentation](https://docs.obsidian.md/Home) in order to
gauge what is possible.

# Code Blocks

1. **language**: `sample`
  This just displays the text that you give it as pre-formatted text, but also
  adds the content of the textarea from the sample panel. The sample panel text
  is dynamic.

2. **language**: `calendar`
  This displays a calendar with optional controls and can optionally mark days
  off. This uses the colors defined in the settings.

```yaml
courseName: Sample Course
month: 12
year: 2025
allowNav: true
markedDays:
  - type: courseOne
    dates:
      2025:
        12: [4, 6, 9]
  - type: courseTwo
    dates:
      2025:
        12: [4, 20]
  - type: courseThree
    dates:
      2025:
        12: [7, 22]
  - type: default
    dates:
      2025:
        12: [1, 2]
  - type: magenta
    dates:
      2025:
        12: [5]
  ```