'use strict';

const clasp_specifications = require('./aliases');

const path = require('path');
const util = require('util');

function parse_integer_(v) {

  if (/^(-\+)?(\d+)$/.test(v)) {

    return Number(v);
  }

  return null;
}

function count_flags_and_options_(specifications) {

  var num_flags = 0;
  var num_options = 0;

  for (var i = 0; i != specifications.length; ++i) {

    var specification = specifications[i];

    if (false);
    else if (clasp_specifications.isFlag(specification)) {
      num_flags += 1;
    }
    else if (clasp_specifications.isOption(specification)) {
      num_options += 1;
    }
  }

  return [ num_flags, num_options ];
}

function lookup_element_by_names_(options, names) {

  for (var i = 0; i != names.length; ++i) {

    var name = names[i];

    if (name in options) {

      return options[name];
    }
  }

  return null;
}

function obtain_exit_code_(options) {

  if ('exit_code' in options) {

    var exit_code = options['exit_code'];

    if ('number' == typeof exit_code) {

      return exit_code;
    } else if ('string' == typeof exit_code) {

      return parse_integer_(exit_code);
    }
  }

  return null;
}

function obtain_program_name_(options) {

  if ('program_name' in options) {

    return options['program_name'];
  } else if ('program-name' in options) {

    return options['program-name'];
  } else {

    return path.basename(process.argv[1]);
  }
}

function obtain_stream_(options, exit_code) {

  if ('stream' in options) {

    return options['stream'];
  }

  switch (exit_code) {

  case 0:

    return process.stdout;
  default:

    return process.stderr;
  }
}

function derive_exiter_(options, exit_code) {

  if (exit_code == null) {

    return function(xc) {

    };
  } else {

    return function(xc) {

      process.exit(xc);
    };
  }
}

function lookup_version_elements_(options) {

  var r = [];

  var major = lookup_element_by_names_(options, [ 'version_major', 'version-major' ]);

  if (major) {

    r.push(major);

    var minor = lookup_element_by_names_(options, [ 'version_minor', 'version-minor' ]);

    if (minor) {

      r.push(minor);

      var patch = lookup_element_by_names_(options, [ 'version_patch', 'version-patch', 'version_revision', 'version-revision' ]);

      if (patch) {

        r.push(patch);

        var build = lookup_element_by_names_(options, [ 'version_build', 'version-build' ]);

        if (build) {

          r.push(build);
        }
      }
    }
  }

  return r;
}

function generate_version_string_(options, apiFunctionName) {

  var program_name = obtain_program_name_(options);
  var version_prefix;
  var version;

  if ('version' in options) {

    version = options['version'];

    if (typeof version === 'string') {

      ;
    } else if(Array.isArray(version)) {

      version = version.join('.');
    }
  } else {

    var version_elements = lookup_version_elements_(options);

    if (!version_elements) {

      // TODO throw exception here!
    }

    version = version_elements.join('.');
  }

  if ('version_prefix' in options) {

    version_prefix = options['version_prefix'];
  } else {

    version_prefix = '';
  }

  return program_name + ' ' + version_prefix + version;
}

/*
* Keys:
* - exit_code : 0, 1, or undefined
* - program_name :
* - stream :
* - version : string or array
*
*/

exports.showUsage = function(specifications, options) {

  let [ num_flags, num_options ] = count_flags_and_options_(specifications);

  for (var i = 0; i != specifications.length; ++i) {

    var specification = specifications[i];

    if (false);
    else if (clasp_specifications.isSpecification(specification)) {

    } else {

      // TODO: throw exception
    }
  }

  var exit_code     = obtain_exit_code_(options);
  var exiter        = derive_exiter_(options, exit_code);
  var program_name  = obtain_program_name_(options);
  var stream        = obtain_stream_(options, exit_code);
  var version       = generate_version_string_(options, 'showVersion');

  var info_lines    = lookup_element_by_names_(options, [ 'info_lines', 'info-lines' ]);

  if (!info_lines) {

    info_lines = [];
  }

  for (var i = 0; i != info_lines.length; ++i) {

    var info_line = info_lines[i];

    if (':version:' == info_line || ':version' == info_line) {

      info_line = version;
    }

    stream.write(info_line + "\n");
  }

  var fno_string = lookup_element_by_names_(options, [ 'flags_and_options_string', 'flags-and-options-string' ]);

  if (!fno_string) {

    if (0 == num_flags) {

      if (0 == num_options) {

        fno_string = '';
      } else {

        fno_string = '[ ... options ... ]';
      }
    } else {

      if (0 == num_options) {

        fno_string = '[ ... flags ... ]';
      } else {

        fno_string = '[ ... flags and options ... ]';
      }
    }
  }

  fno_string = fno_string.trim();

  if (fno_string) {

    fno_string = ' ' + fno_string;
  }
  if (!fno_string) {

    fno_string = '';
  }

  var values_string = lookup_element_by_names_(options, [ 'values_string', 'values-string' ]);

  if (values_string) {

    values_string = values_string.trim();
  }
  if (values_string) {

    values_string = ' ' + values_string;
  }
  if (!values_string) {

    values_string = '';
  }


  var usage_line = util.format("USAGE: %s%s%s", program_name, fno_string, values_string);

  stream.write(usage_line + "\n");
  stream.write("\n");

  if (0 != specifications.length) {

    stream.write("flags/options:\n");
    stream.write("\n");

    for (var i = 0; i != specifications.length; ++i) {

      var specification = specifications[i];

      if (clasp_specifications.isSpecification(specification)) {

        var isOption      = clasp_specifications.isOption(specification);
        var suffix_short  = isOption ? ' <value>' : '';
        var suffix_long   = isOption ? '=<value>' : '';

        for (var j = 0; j != specification.aliases.length; ++j) {

          var line = util.format("\t%s%s\n", specification.aliases[j], suffix_short);

          stream.write(line);
        }

        var line = util.format("\t%s%s\n", specification.name, suffix_long);

        stream.write(line);

        var help = util.format("\t\t%s\n", specification.help);

        stream.write(help);

        stream.write("\n");
      }
    }
  }

  exiter(exit_code);
}

exports.showVersion = function(options) {

  var exit_code = obtain_exit_code_(options);
  var exiter    = derive_exiter_(options, exit_code);
  var stream    = obtain_stream_(options, exit_code);
  var version   = generate_version_string_(options, 'showVersion');

  stream.write(version + "\n");

  exiter(exit_code);
}


/* ///////////////////////////// end of file //////////////////////////// */

