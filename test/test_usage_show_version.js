'use strict';

const clasp = require('../index');

const assert = require('assert');
const mstreams = require('memory-streams');

// Node's String.prototype.split() obtains an additional empty last element,
// as in:
//
//   ar = 'abc|'.split('|'); // yields [ "abc", "" ]
//
// This is in common with Go:
//
//   ar := strings.Split("abc|", "|"); // yields ["abc" ""]
//
// and Python:
//
//   ar = "abc|".split("|") # yields ['abc', '']
//
// Conversely, Ruby doesn't include an empty last element for the 0-length
// string after a trailing separator:
//
//   ar = 'abc'.split('|') # yeidds ["abc"]
//
// This is the behaviour that's required.
function sensible_split_(s, separator = null, limit = null) {

  var r;

  if (false) {

    ;
  } else if (null === separator) {

    r = s.split();
  } else if (null === limit) {

    r = s.split(separator);
  } else {

    r = s.split(separator, limit);
  }

  if (0 != r.length) {

    if (null !== separator) {

      if (0 == (r[r.length - 1]).length) {

        if (separator == s.slice(-1)) {

          r.pop();
        }
      }
    }
  }

  return r;
}

describe('clasp.usage.showUsage()', function() {

  it('works with minimal input', function() {

    var specifications = [
    ];

    var info_lines = [
    ];

    var stm = new mstreams.WritableStream();
    var args = {

      program_name: 'myprog',

      version: null,

      info_lines: info_lines,

      flags_and_options_string: ' ',

      values_string: null,

      stream: stm
    };

    clasp.usage.showUsage(specifications, args);

    var actual = stm.toString();
    var expected = [

        'USAGE: myprog',
        '',
    ];

    actual = sensible_split_(actual, "\n");


    assert.deepEqual(expected, actual);
  });

  it('works with standard specifications, program-name, []int version', function() {

    var specifications = [

      clasp.specifications.HELP_FLAG,
      clasp.specifications.VERSION_FLAG,
    ];

    var info_lines = [

      'CLASP.js Test Suite',
      '',
      ':version:',
      '',
    ];

    var stm = new mstreams.WritableStream();
    var args = {

      program_name: 'myprog',

      version: [ 1, 2, 3 ],

      info_lines: info_lines,

      flags_and_options_string: null,

      values_string: '',

      stream: stm
    };

    clasp.usage.showUsage(specifications, args);

    var actual = stm.toString();
    var expected = info_lines.slice();

    actual = sensible_split_(actual, "\n");

    expected[2] = 'myprog 1.2.3';

    expected = expected.concat([

        'USAGE: myprog [ ... flags ... ]',
        '',
        'flags/options:',
        '',
    ]);

    expected = expected.concat([

        '\t--help',
        '\t\tShows usage and terminates',
        '',
        '\t--version',
        '\t\tShows version and terminates',
        '',
    ]);


    assert.deepEqual(expected, actual);
  });

  it('works with custom specifications, program-name, []int version', function() {

    var specifications = [

      clasp.specifications.Flag('--verbose', { alias: '-v', help: 'Makes it verbose' }),

      clasp.specifications.HELP_FLAG,
      clasp.specifications.VERSION_FLAG,
    ];

    var info_lines = [

      'CLASP.js Test Suite',
      '',
      ':version:',
      '',
    ];

    var stm = new mstreams.WritableStream();
    var args = {

      program_name: 'myprog',

      version: [ 1, 2, 3 ],

      info_lines: info_lines,

      flags_and_options_string: '... flags/options ...',

      values_string: '<path-1> <path-2>',

      stream: stm
    };

    clasp.usage.showUsage(specifications, args);

    var actual = stm.toString();
    var expected = info_lines.slice();

    actual = sensible_split_(actual, "\n");

    expected[2] = 'myprog 1.2.3';

    expected = expected.concat([

        'USAGE: myprog ... flags/options ... <path-1> <path-2>',
        '',
        'flags/options:',
        '',
    ]);

    expected = expected.concat([

        '\t-v',
        '\t--verbose',
        '\t\tMakes it verbose',
        '',
        '\t--help',
        '\t\tShows usage and terminates',
        '',
        '\t--version',
        '\t\tShows version and terminates',
        '',
    ]);


    assert.deepEqual(expected, actual);
  });
});

describe('clasp.usage.showVersion()', function() {

  it('works with program-name and string version', function() {

    var stm = new mstreams.WritableStream();
    var args = {

      program_name: 'myprog',

      version: '0.1.2',

      stream: stm
    };

    clasp.usage.showVersion(args);

    assert.equal('myprog 0.1.2\n', stm.toString());
  });

  it('works with program-name, version-prefix and string version', function() {

    var stm = new mstreams.WritableStream();
    var args = {

      program_name: 'myprog',

      version: '0.1.3',
      version_prefix: 'v',

      stream: stm
    };

    clasp.usage.showVersion(args);

    assert.equal('myprog v0.1.3\n', stm.toString());
  });

  it('works with program-name and array-of-numbers version', function() {

    var stm = new mstreams.WritableStream();
    var args = {

      program_name: 'myprog',

      version: [ 1, 2, 3, 456 ],

      stream: stm
    };

    clasp.usage.showVersion(args);

    assert.equal('myprog 1.2.3.456\n', stm.toString());
  });

  it('works with program-name, version-prefix and array-of-strings version', function() {

    var stm = new mstreams.WritableStream();
    var args = {

      program_name: 'myprog',

      version: [ '5', '2', '0-rc1' ],
      version_prefix: 'v',

      stream: stm
    };

    clasp.usage.showVersion(args);

    assert.equal('myprog v5.2.0-rc1\n', stm.toString());
  });
});


/* ///////////////////////////// end of file //////////////////////////// */

