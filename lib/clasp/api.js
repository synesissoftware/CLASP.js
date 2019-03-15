'use strict';

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

		var r			=	_parse(argv, aliases);

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

		var r = re1.exec(arg);

		if (r) {


			var	hyphens			=	r[1];
			var	given_label		=	r[2];
			var given_name		=	r[0];
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

