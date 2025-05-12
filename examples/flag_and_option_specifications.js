#! /usr/bin/env node --use_strict

// examples/flag_and_option_specifications.js

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

const ProgramVersion = "0.0.2";
const info_lines = [

  'CLASP.js examples',
  ':version',
  "Illustrates use of CLASP.js's use of flags, options, and aliases",
  '',
];

// Define specifications, parse, and checking standard flags

const flag_Debug        = clasp.specifications.Flag('--debug', { alias: '-d', help: 'runs in Debug mode' });
const option_Verbosity  = clasp.specifications.Option('--verbosity', { alias: '-v', help: 'specifies the verbosity', values: [ 'terse', 'quiet', 'silent', 'chatty' ]});
const flag_Chatty       = clasp.specifications.Flag('--verbosity=chatty', { alias: '-c' });

const specifications = [

  flag_Debug,
  option_Verbosity,
  flag_Chatty,

  clasp.specifications.HELP_FLAG,
  clasp.specifications.VERSION_FLAG,
];


var args = clasp.api.parse(process.argv, specifications);

if (args.flagIsSpecified(clasp.specifications.HELP_FLAG)) {

  clasp.usage.showUsage(specifications, {

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


