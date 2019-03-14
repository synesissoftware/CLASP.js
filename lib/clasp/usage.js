'use strict';

const path = require('path');

function parse_integer_(v) {

	if (/^(-\+)?(\d+)$/.test(v)) {

		return Number(v);
	}

	return null;
}

function obtain_exit_code_(args) {

	if ('exit_code' in args) {

		var exit_code = args['exit_code'];

		if ('number' == typeof exit_code) {

			return exit_code;
		} else if ('string' == typeof exit_code) {

			return parse_integer_(exit_code);
		}
	}

	return null;
}

function obtain_program_name_(args) {

	if ('program_name' in args) {

		return args['program_name'];
	} else if ('program-name' in args) {

		return args['program-name'];
	} else {

		path.basename(process.argv[1]);
	}
}

function obtain_stream_(args, exit_code) {

	if ('stream' in args) {

		return args['stream'];
	}

	switch (exit_code) {

	case 0:

		return process.stdout;
	default:

		return process.stderr;
	}
}

function derive_exiter_(args, exit_code) {

	if (exit_code == null) {

		return function(xc) {

		};
	} else {

		return function(xc) {

			process.exit(xc);
		};
	}
}

function lookup_element_by_names_(args, names) {

	for (var i = 0; i != names.length; ++i) {

		var name = names[i];

		if (name in args) {

			return args[name];
		}
	}

	return null;
}

function lookup_version_elements_(args) {

	var r = [];

	var major = lookup_element_by_names_(args, [ 'version_major', 'version-major' ]);

	if (major) {

		r.push(major);

		var minor = lookup_element_by_names_(args, [ 'version_minor', 'version-minor' ]);

		if (minor) {

			r.push(minor);

			var patch = lookup_element_by_names_(args, [ 'version_patch', 'version-patch', 'version_revision', 'version-revision' ]);

			if (patch) {

				r.push(patch);

				var build = lookup_element_by_names_(args, [ 'version_build', 'version-build' ]);

				if (build) {

					r.push(build);
				}
			}
		}
	}

	return r;
}

function generate_version_string_(args, apiFunctionName) {

	var program_name = obtain_program_name_(args);
	var version_prefix;
	var version;

	if ('version' in args) {

		version = args['version'];

		if (typeof version === 'string') {

			;
		} else if(Array.isArray(version)) {

			version = version.join('.');
		}
	} else {

		var version_elements = lookup_version_elements_(args);

		if (!version_elements) {

			// TODO throw exception here!
		}

		version = version_elements.join('.');
	}

	if ('version_prefix' in args) {

		version_prefix = args['version_prefix'];
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

exports.showVersion = function(args) {

	var exit_code	=	obtain_exit_code_(args);
	var exiter		=	derive_exiter_(args, exit_code);
	var stream		=	obtain_stream_(args, exit_code);
	var version		=	generate_version_string_(args, 'showVersion');

	stream.write(version + "\n");

	exiter(exit_code);
}

