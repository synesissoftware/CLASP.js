'use strict';

const clasp_aliases = require('./aliases');

const util = require('util');

class Argument {

	constructor(arg, given_index, given_name, resolved_name, argument_alias, given_hyphens, given_label, extras) {

		this.arg            =   arg
		this.given_index    =   given_index
		this.given_name     =   given_name
		this.argument_alias =   argument_alias
		this.given_hyphens  =   given_hyphens
		this.given_label    =   given_label
		this.name           =   resolved_name ? resolved_name : given_name
		this.extras         =   extras ? extras : {}
	}
};

class FlagArgument extends Argument {

	constructor(arg, given_index, given_name, resolved_name, argument_alias, given_hyphens, given_label, extras) {

		super(arg, given_index, given_name, resolved_name, argument_alias, given_hyphens, given_label, extras);

	}
};

class OptionArgument extends Argument {

	constructor(arg, given_index, given_name, resolved_name, argument_alias, given_hyphens, given_label, value, extras) {

		super(arg, given_index, given_name, resolved_name, argument_alias, given_hyphens, given_label, extras);

		this.value	=	value;
	}
};

class Arguments {

	constructor(argv, aliases) {

		this.argv		=	argv;
		this.aliases	=	aliases ? aliases : [];

		var r			=	_parse(argv, this.aliases);

		this.flags		=	r[0];
		this.options	=	r[1];
		this.values		=	r[2];
	}
};

function _parse(argv, aliases) {

	var	flags		=	[];
	var options		=	[];
	var values		=	[];

	var forced_value	=	false;
	var current_option	=	null;

	for (var index = 0; index + 1 < argv.length; ++index) {

		var arg = argv[index + 1];

		if (!forced_value) {

			if ('--' == arg) {

				forced_value = true;

				continue;
			}
		}

		if (current_option) {

			current_option.value = arg;

			options.push(current_option);

			current_option = null;

			continue;
		}

		if (forced_value) {

			values.push(arg);

			continue;
		}

		var re1 = /^(-+)([^=]+)/;

		var m = re1.exec(arg);

		if (m) {


			var	hyphens			=	m[1];
			var	given_label		=	m[2];
			var given_name		=	m[0];
			var resolved_name	=	given_name;
			var argument_alias	=	null;
			var extras			=	null;
			var value			=	null;
			var is_option		=	false;

			if (given_name != arg) {

				value		=	arg.slice(1 + given_name.length);
				is_option	=	true;
			} else {

				var sel_aliases	=	null; // _select_aliases(args, aliases);

				if (sel_aliases) {

					;
				}
			}




			// check aliases

			for (var j = 0; j != aliases.length; ++j) {

				var a = aliases[j];

				if (a.name == given_name || a.aliases.includes(given_name)) {

					is_option			=	clasp_aliases.isOption(a);

					resolved_name		=	a.name;
					argument_alias		=	a;
					extras				=	a.extras;

					var hyphens_2		=	null;
					var given_label_2	=	null;
					var value_2			=	null;
					var resolved_name_2	=	null;

					var alias_has_value	=	false;

					var re2				=	/^(-+)([^=]+)=(.*)/;
					var m2				=	re2.exec(resolved_name);

					if (m2) {

						alias_has_value	=	true;

						hyphens_2		=	m2[1];
						given_label_2	=	m2[2];
						value_2			=	m2[3];
						resolved_name_2	=	hyphens_2 + given_label_2;

						resolved_name	=	resolved_name_2;
					}

					if (is_option) {

						// value can be empty string

						if ('' === value) {

							if (alias_has_value) {

								value	=	value_2;
							}
						}

						if ('' === value) {

							if (a.default_value) {

								value	=	a.default_value;
							}
						}
					} else {

						if (alias_has_value) {

							is_option	=	true;
							value		=	value_2;
						}
					}

					break;
				}
			}


			// final placement

			if (is_option) {

				var option	=	new OptionArgument(arg, index, given_name, resolved_name, argument_alias, hyphens.length, given_label, value, extras);

				if (null === value) {

					current_option	=	option;
				} else {

					options.push(option);
				}

			} else {

				var flag	=	new FlagArgument(arg, index, given_name, resolved_name, argument_alias, hyphens.length, given_label, extras);

				flags.push(flag);
			}
		} else {

			values.push(arg);
		}
	}


	if (current_option) {

		value	=	null;

		var	alias	=	current_option.argument_alias;

		if (alias) {

			if (alias.default_value) {

				current_option.value = alias.default_value;
			}
		}

		options.push(current_option);

		current_option = null;
	}

	return [ flags, options, values ];
}

function parse_args(argv, aliases = null) {

	return new Arguments(argv, aliases);
}

module.exports.parse = parse_args;

module.exports.isFlag = function(v) {

	return v instanceof FlagArgument;
}

module.exports.isOption = function(v) {

	return v instanceof OptionArgument;
}

