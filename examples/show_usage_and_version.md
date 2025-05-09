# CLASP.js Example - **show_usage_and_version** <!-- omit in toc -->

## Summary

Simple example supporting ```--help``` and ```--version```.

## Source

```javascript
#! /usr/bin/env node --use_strict

// examples/show_usage_and_version.js

'use strict';

// requires

const clasp = require('clasp-js');

const util = require('util');

// helpers

function format_to(stm, fmt, ...args) {

	var s = util.format(fmt, ...args);

	stm.write(s);
}

// constants

const ProgramVersion = "0.0.1";
const info_lines = [

	'CLASP.js examples',
	':version',
	"Illustrates use of CLASP.js's show_usage() and show_version() methods",
	'',
];

// Specify aliases, parse, and checking standard flags

const aliases = [

	clasp.specifications.HELP_FLAG,
	clasp.specifications.VERSION_FLAG,
];


var args = clasp.api.parse(process.argv, aliases);

if (args.flagIsSpecified(clasp.specifications.HELP_FLAG)) {

	clasp.usage.showUsage(aliases, {

		version: ProgramVersion,
		info_lines: info_lines,
		exit_code: 0,
	});
}

if (args.flagIsSpecified('--version')) {

	clasp.usage.showVersion({

		version: ProgramVersion,
		exit_code: 0,
	});
}


// Check for any unrecognised flags or options

var unused = null;
if (null != (unused = args.getFirstUnusedFlagOrOption())) {

	format_to(process.stderr, "%s: unrecognised flag/option: %s\n", args.program_name, unused.name);

	process.exit(1)
}
```

## Usage

### No arguments

If executed with no arguments

```
    node examples/show_usage_and_version.js
```

or (in a Unix shell):

```
    ./examples/show_usage_and_version.js
```

it gives the output:

```
no flags specified
```

### Show usage

If executed with the arguments

```
    node examples/show_usage_and_version.js --help
```

it gives the output:

```
CLASP.js examples
show_usage_and_version.js 0.0.1
Illustrates use of CLASP.js's show_usage() and show_version() methods

USAGE: show_usage_and_version.js [ ... flags and options ... ]

flags/options:

	--help
		Shows usage and terminates

	--version
		Shows version and terminates
```

### Show version

If executed with the arguments

```
    node examples/show_usage_and_version.js --version
```

it gives the output:

```
show_usage_and_version.js 0.0.1
```

### Unknown option

If executed with the arguments

```
    node examples/show_usage_and_version.js --unknown=value
```

it gives the output (on the standard error stream):

```
show_usage_and_version.js: unrecognised flag/option: --unknown=value
```

with an exit code of 1


<!-- ########################### end of file ########################### -->

