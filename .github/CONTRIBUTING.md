# Contributing to Obvia

We are really excited that you would like to contribute to Obvia and help make it even better than it is! However, before submitting your application, please take a moment to read through the following guidelines:

- [Code of Conduct](#code-of-conduct)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct
We would like to keep Obvia an open and inclusive community to everybody. Please read and follow our [Code of Conduct.](https://github.com/obviajs/obvia/blob/master/.github/CODE_OF_CONDUCT.md)

## Issue Reporting Guidelines
Before submitting an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion can help you find a solution or workaround.

We want to address the issues as soon as possible, but before we can fix a bug, we need to reproduce and confirm it. Therefore, when submitting a bug report, we require that you provide a minimal reproduction, which can provide us with valuable information in order to isolate the problem. 
Unfortunately, we cannot investigate or fix bugs without a minimal reproduction, so if we do not hear back from you, we are going to close an issue that doesn't have enough information to be reproduced.

You can file new issues by filling out one of our [new issue templates](https://github.com/obviajs/obvia/issues/new/choose).

## Pull Request Guidelines
Before you submit your Pull Request (PR), please consider the following guidelines:
1.	Search GitHub for an open or closed PR that relates to your submission, so that you do not duplicate an existing effort.
2.	Please describe the issue you are fixing and the design for the feature you would like to add. Ideally, you should submit an issue first and have it approved before working on it.
3.	If you are fixing a bug or special issue, please include the issue id in the title. (e.g. fix #1456)
4.	Fork the Obvia repository.
5.	Make your changes in a new git branch.
6.	Make sure your code adheres to the JavaScript coding conventions. You can read [Google's JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html) for more information.
7.	Commit your changes using a descriptive commit message following our commit message conventions.
8.	Push your branch to GitHub.
9.	Afterwards, send a pull request to Obvia's repository.
10.	The code will be reviewed, and if necessary, you will be asked to make changes accordingly.


## Commit Message Guidelines
In order to make the commit history easier to read and understand, we have specific rules on how Git commit messages must be formatted.

Each commit message consists of a **header**, a **body**, and a **footer**.
```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```
**Commit Message Header**
The header is mandatory and must adhere to the following structure:
```
<type>[optional scope]: <description>
```

Type must be of the following:
- docs: changes in documentation only
- feat: a new feature
- fix: a bug fix
- refactor: code change that neither fixes a bug nor adds a new feature

The scope is optional and may be provided to provide additional contextual information to the commit.
The description must provide a short summary of the code changes.

**Commit Message Body**
A longer commit message body may be provided after the description to provide additional information about the code changes. The body should explain why the change is being made, as well as a comparison between the previous behavior and the new one to illustrate the impact of the change.

**Commit Message Footer**
The footer may contain information about breaking changes and should reference GitHub issues that this commit closes. A ‘BREAKING CHANGE’ footer introduces a breaking API change. A footer must adhere to the following structure:
```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description & migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```