#!/usr/bin/env node --use_strict

// examples/show_usage_and_version.js

'use strict';

// requires

var clasp;
try {

	clasp = require('clasp-js');
} catch (x) {

	clasp = require('../lib/clasp');
}

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


// Check for any unrecognised flags or options

var unused = null;
if (null != (unused = args.getFirstUnusedFlagOrOption())) {

	format_to(process.stderr, "%s: unrecognised flag/option: %s\n", args.program_name, unused);

	process.exit(1)
}


format_to(process.stdout, "no flags specified\n");

