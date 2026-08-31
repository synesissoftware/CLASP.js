# CLASP.js <!-- omit in toc -->

**C**ommand-**L**ine **A**rgument **S**orting and **P**arsing, for JavaScript

![Language](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
[![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![NPM Version](https://img.shields.io/npm/v/clasp-js.svg)](https://www.npmjs.com/package/clasp-js)
[![NPM Downloads](https://img.shields.io/npm/dm/clasp-js.svg)](https://www.npmjs.com/package/clasp-js)
[![GitHub release](https://img.shields.io/github/v/release/synesissoftware/CLASP.js.svg)](https://github.com/synesissoftware/CLASP.js/releases/latest)
[![Last Commit](https://img.shields.io/github/last-commit/synesissoftware/CLASP.js)](https://github.com/synesissoftware/CLASP.js/commits/master)
[![Node](https://github.com/synesissoftware/CLASP.js/actions/workflows/node.yml/badge.svg)](https://github.com/synesissoftware/CLASP.js/actions/workflows/node.yml)


## Table of Contents <!-- omit in toc -->

- [Summary](#summary)
- [Introduction](#introduction)
- [Installation \& usage](#installation--usage)
  - [The name](#the-name)
- [Components](#components)
  - [Command-line parsing](#command-line-parsing)
  - [Declarative specification of flags and options](#declarative-specification-of-flags-and-options)
  - [Utility functions for displaying usage and version information](#utility-functions-for-displaying-usage-and-version-information)
- [Examples](#examples)
- [Project Information](#project-information)
  - [Where to get help](#where-to-get-help)
  - [Contribution guidelines](#contribution-guidelines)
  - [Dependencies](#dependencies)
    - [Development/Testing Dependencies](#developmenttesting-dependencies)
  - [Related projects](#related-projects)
  - [License](#license)


## Summary

**CLASP** stands for **C**ommand-**L**ine **A**rgument **S**orting and **P**arsing. The first CLASP library was a C library with a C++ wrapper. There have been several implementations in other languages. **CLASP.js** is the JavaScript version.


## Introduction

**CLASP** stands for **C**ommand-**L**ine **A**rgument **S**orting and **P**arsing. The first **CLASP** library was a C library with a C++ wrapper (see project [**CLASP**](https://github.com/synesissoftware/CLASP)). There have been [several implementations in other languages](#related-projects). **CLASP.js** is the JavaScript version.

All **CLASP** libraries provide facilities for **C**ommand **L**ine **I**nterface (**CLI**) programs as described in the [Components](#components) section below.


## Installation & usage

Install using `npm install clasp-js`.

Use it via `require('clasp-js')`.


### The name

NOTE: the name **clasp-js** follows [NPM's package-name rules](https://docs.npmjs.com/files/package.json), but breaks with one of the tips - the one about not including **js** or **node** in the name - because there are multiple CLASP libraries, and there already exists a [**clasp** package in **NPM**](https://www.npmjs.com/package/clasp).


## Components


### Command-line parsing

All **CLASP** libraries discriminate between three types of command-line arguments:

* *flags* are hyphen-prefixed arguments that are either present or absent, and hence have a boolean nature;
* *options* are hyphen-prefixed arguments that are given values; and
* *values* are non-hyphen-prefixed arguments that represent values.

For example, in the command line

```
myprog --all -c --opt1=val1 infile outfile
```

there are:

* two *flags*, `--all` and `-c`;
* one *option* called `--opt1`, which has the value `val1`; and
* two *values*, `infile` and `outfile`.

*Flags* and *options* may have aliases. One-letter *flags* may be combined. Option aliases may specify a value, and may be combined with one-letter flags. UNIX de-facto standard arguments confer specific meanings:

* `--help` means that the program should show the usage/help information and terminate;
* `--version` means that the program should show the version information and terminate;
* `--` means that all subsequent arguments should be treated as values, regardless of any hyphen-prefixes or embedded `=` signs.


### Declarative specification of flags and options

**CLASP.js** provides the `clasp.specifications` module to declare *flags* and *options* and their aliases. Use `Flag()` and `Option()` to build a specification list, then pass it to `clasp.api.parse()`. See [EXAMPLES.md](./EXAMPLES.md) for worked examples.


### Utility functions for displaying usage and version information

**CLASP.js** provides `clasp.usage.showUsage()` and `clasp.usage.showVersion()` to display help and version information and optionally terminate the process. Standard `--help` and `--version` specifications are available via `clasp.specifications.HELP_FLAG` and `clasp.specifications.VERSION_FLAG`.


## Examples

Examples are provided in the `examples` directory, along with a markdown description for each. A detailed list TOC of them is provided in [EXAMPLES.md](./EXAMPLES.md).


## Project Information


### Where to get help

[GitHub Page](https://github.com/synesissoftware/CLASP.js "GitHub Page")


### Contribution guidelines

Defect reports, feature requests, and pull requests are welcome on https://github.com/synesissoftware/CLASP.js.


### Dependencies

None


#### Development/Testing Dependencies

* [**mocha**](https://www.npmjs.com/package/mocha);


### Related projects

**CLASP.js** is inspired by the [C/C++ CLASP library](https://github.com/synesissoftware/CLASP), which is documented in the articles:

* _An Introduction to CLASP_, Matthew Wilson, [CVu](https://accu.org/index.php/journals/c77/), January 2012;
* _[Anatomy of a CLI Program written in C](https://synesis.com.au/publishing/software-anatomies/anatomy-of-a-cli-program-written-in-c.html)_, Matthew Wilson, [CVu](https://accu.org/index.php/journals/c77/), September 2012; and
* _[Anatomy of a CLI Program written in C++](https://synesis.com.au/publishing/software-anatomies/anatomy-of-a-cli-program-written-in-c++.html)_, Matthew Wilson, [CVu](https://accu.org/index.php/journals/c77/), September 2015.

Other CLASP libraries include:

* [**CLASP**](https://github.com/synesissoftware/CLASP/);
* [**CLASP.Go**](https://github.com/synesissoftware/CLASP.Go/);
* [**CLASP.NET**](https://github.com/synesissoftware/CLASP.NET/);
* [**CLASP.Python**](https://github.com/synesissoftware/CLASP.Python/);
* [**CLASP.Ruby**](https://github.com/synesissoftware/CLASP.Ruby/).


### License

**CLASP.js** is released under the 3-clause BSD license. See [LICENSE](./LICENSE) for details.


<!-- ########################### end of file ########################### -->

