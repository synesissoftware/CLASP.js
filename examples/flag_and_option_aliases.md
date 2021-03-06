# CLASP.js Example - **show_usage_and_version**

## Summary

Example illustrating various kinds of *flag* and *option* aliases, including the combination of short-names.

## Source

```javascript
#!/usr/bin/env node --use_strict

// examples/flag_and_option_aliases.js

'use strict';

const clasp = require('clasp-js');

const util = require('util');

const ProgramVersion = "0.0.1";
const info_lines = [

	'CLASP.js examples',
	':version',
	"Illustrates use of CLASP.js's clasp.show_usage() and clasp.show_version() methods",
	'',
];

const flag_Debug = clasp.aliases.Flag('--debug', { alias: '-d', help: 'runs in Debug mode' });
const option_Verbosity = clasp.aliases.Option('--verbosity', { alias: '-v', help: 'specifies the verbosity', values: [ 'terse', 'quiet', 'silent', 'chatty' ]});
const flag_Chatty = clasp.aliases.Flag('--verbosity=chatty', { alias: '-c' });

function format_to(stm, fmt, ...args) {

	var s = util.format(fmt, ...args);

	stm.write(s);
}

// Specify aliases, parse, and checking standard flags

const aliases = [

	flag_Debug,
	option_Verbosity,
	flag_Chatty,

	clasp.aliases.HELP_FLAG,
	clasp.aliases.VERSION_FLAG,
];


var args = clasp.api.parse(process.argv, aliases);

if (args.flagIsSpecified(clasp.aliases.HELP_FLAG)) {

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

// Program-specific processing of flags/options

var opt = null;
if (null != (opt = args.lookupOption('--verbosity'))) {

	format_to(process.stdout, "verbosity is specified as: %s\n", opt.value);
}

if (args.flagIsSpecified('--debug')) {

	format_to(process.stdout, "Debug mode is specified\n");
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
    node examples/flag_and_option_aliases.js
```

or (in a Unix shell):

```
    ./examples/flag_and_option_aliases.js
```

it gives the output:

```
```

### Show usage

If executed with the arguments

```
    node examples/flag_and_option_aliases.js --help
```

it gives the output:

```
CLASP.js examples
flag_and_option_aliases.js 0.0.1
Illustrates use of CLASP.js's clasp.show_usage() and clasp.show_version() methods

USAGE: flag_and_option_aliases.js [ ... flags and options ... ]

flags/options:

	-d
	--debug
		runs in Debug mode

	-v <value>
	--verbosity=<value>
		specifies the verbosity

	-c
	--verbosity=chatty
		null

	--help
		Shows usage and terminates

	--version
		Shows version and terminates
```

### Specify flags and options in long-form

If executed with the arguments

```
    node examples/flag_and_option_aliases.js --debug --verbosity=silent
```

it gives the output:

```
verbosity is specified as: silent
Debug mode is specified
```

### Specify flags and options in short-form

If executed with the arguments

```
    node examples/flag_and_option_aliases.js -v silent -d
```

it gives the (same) output:

```
verbosity is specified as: silent
Debug mode is specified
```

### Specify flags and options in short-form, including an alias for an option-with-value

If executed with the arguments

```
    node examples/flag_and_option_aliases.js -c -d
```

it gives the output:

```
verbosity is specified as: chatty
Debug mode is specified
```

### Specify flags and options with combined short-form

If executed with the arguments

```
    node examples/flag_and_option_aliases.js -dc
```

it gives the (same) output:

```
verbosity is specified as: chatty
Debug mode is specified
```
