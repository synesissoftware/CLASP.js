'use strict';

class Alias {

	constructor(name, options) {


		if (null === options || undefined === options) {

			options = {};
		}

		this.name		=	name;
		this.help		=	null;
		this.aliases	=	[];
		this.extras		=	null;

		for (var key in options) {

			var value = options[key];

			if (false);
			else if ('help' == key) {

				this.help = value;
			}
			else if ('aliases' == key) {

				this.aliases = this.aliases.concat(value);
			}
			else if ('alias' == key) {

				this.aliases.push(value);
			}
			else if ('extras' == key) {

				this.extras = value;
			}
		}
	}
};

class FlagAlias extends Alias {

	constructor(name, options) {

		super(name, options);
	}
};

class OptionAlias extends Alias {

	constructor(name, options) {


		super(name, options);

		this.default_value	=	null;

		if (options) {

			if ('default_value' in options) {

				this.default_value	=	options['default_value'];
			}
		}
	}
};

const constants = Object.freeze({

	HELP_FLAG: new FlagAlias('--help', { help: 'Shows usage and terminates' }),
	VERSION_FLAG: new FlagAlias('--version', { help: 'Shows version and terminates' }),

	_null: null
});

function _null() {

}

function make_Alias(name, options) {

	return new Alias(name, options);
}

function make_Flag(name, options) {

	return new FlagAlias(name, options);
}

function make_Option(name, options) {

	return new OptionAlias(name, options);
}

module.exports.Flag = make_Flag;

module.exports.Option = make_Option;

module.exports.isAlias = function(v) {

	return v instanceof Alias;
}

module.exports.isFlag = function(v) {

	return v instanceof FlagAlias;
}

module.exports.isOption = function(v) {

	return v instanceof OptionAlias;
}

module.exports.HELP_FLAG = constants.HELP_FLAG;

module.exports.VERSION_FLAG = constants.VERSION_FLAG;


