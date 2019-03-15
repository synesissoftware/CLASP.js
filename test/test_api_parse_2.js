'use strict';

const clasp = require('../index');

const assert = require('assert');
const mstreams = require('memory-streams');

const util = require('util');

function _isPlainObject(obj) {

	return obj != null && typeof(obj) == "object" && Object.getPrototypeOf(obj) == Object.prototype;
}

describe('clasp.api.parse()', function() {

	describe('with aliases', function() {

		it('one flag and one option and one value, with empty aliases', function() {

			var aliases = [];

			var argv = [ 'bin/myprog', '-f1', 'value1', '--first-option=val1' ];
			var args = clasp.api.parse(argv, aliases);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(1, args.flags.length);

			var flag0 = args.flags[0];

			assert.ok(clasp.api.isFlag(flag0));
			assert.equal(0, flag0.given_index);
			assert.equal('-f1', flag0.given_name);
			assert.strictEqual(null, flag0.argument_alias);
			assert.equal(1, flag0.given_hyphens);
			assert.equal('f1', flag0.given_label);
			assert.equal('-f1', flag0.name);
			assert.ok(_isPlainObject(flag0.extras));

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(1, args.options.length);

			var option0 = args.options[0];

			assert.ok(clasp.api.isOption(option0));
			assert.equal(2, option0.given_index);
			assert.equal('--first-option', option0.given_name);
			assert.strictEqual(null, option0.argument_alias);
			assert.equal(2, option0.given_hyphens);
			assert.equal('first-option', option0.given_label);
			assert.equal('--first-option', option0.name);
			assert.equal('val1', option0.value);
			assert.ok(_isPlainObject(option0.extras));

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(1, args.values.length);

			assert.equal('value1', args.values[0]);
		});

		it('alias of flag with one alias', function() {

			var aliases = [

				clasp.aliases.Flag('--verbose', { alias: '-v' }),
			];

			var argv = [ 'bin/myprog', '--verbose', '--succinct', 'value', '-v' ];
			var args = clasp.api.parse(argv, aliases);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(3, args.flags.length);

			var flag0 = args.flags[0];

			assert.ok(clasp.api.isFlag(flag0));
			assert.equal(0, flag0.given_index);
			assert.equal('--verbose', flag0.given_name);
			assert.ok(null !== flag0.argument_alias);
			assert.equal(2, flag0.given_hyphens);
			assert.equal('verbose', flag0.given_label);
			assert.equal('--verbose', flag0.name);
			assert.ok(_isPlainObject(flag0.extras));

			var flag1 = args.flags[1];

			assert.ok(clasp.api.isFlag(flag1));
			assert.equal(1, flag1.given_index);
			assert.equal('--succinct', flag1.given_name);
			assert.strictEqual(null, flag1.argument_alias);
			assert.equal(2, flag1.given_hyphens);
			assert.equal('succinct', flag1.given_label);
			assert.equal('--succinct', flag1.name);
			assert.ok(_isPlainObject(flag1.extras));

			var flag2 = args.flags[2];

			assert.ok(clasp.api.isFlag(flag2));
			assert.equal(3, flag2.given_index);
			assert.equal('-v', flag2.given_name);
			assert.ok(null !== flag2.argument_alias);
			assert.equal(1, flag2.given_hyphens);
			assert.equal('v', flag2.given_label);
			assert.equal('--verbose', flag2.name);
			assert.ok(_isPlainObject(flag2.extras));

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(0, args.options.length);

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(1, args.values.length);

			assert.equal('value', args.values[0]);
		});

		it('alias of flag with two aliases', function() {

			var aliases = [

					clasp.aliases.Flag('--expand', { aliases: [ '-x', '--x' ], extras: { 'some-value': [ 'e', 'x', 't', 'r', 'a', 's', ] } }),
			];

			var argv = [ 'bin/myprog', '-f1', 'value1', '-x', '--delete', '--x' ];
			var args = clasp.api.parse(argv, aliases);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(4, args.flags.length);

			var flag0 = args.flags[0];

			assert.ok(clasp.api.isFlag(flag0));
			assert.equal(0, flag0.given_index);
			assert.equal('-f1', flag0.given_name);
			assert.strictEqual(null, flag0.argument_alias);
			assert.equal(1, flag0.given_hyphens);
			assert.equal('f1', flag0.given_label);
			assert.equal('-f1', flag0.name);
			assert.ok(_isPlainObject(flag0.extras));

			var flag1 = args.flags[1];

			assert.ok(clasp.api.isFlag(flag1));
			assert.equal(2, flag1.given_index);
			assert.equal('-x', flag1.given_name);
			assert.ok(null !== flag1.argument_alias);
			assert.equal(1, flag1.given_hyphens);
			assert.equal('x', flag1.given_label);
			assert.equal('--expand', flag1.name);
			assert.ok(_isPlainObject(flag1.extras));

			var flag2 = args.flags[2];

			assert.ok(clasp.api.isFlag(flag2));
			assert.equal(3, flag2.given_index);
			assert.equal('--delete', flag2.given_name);
			assert.strictEqual(null, flag2.argument_alias);
			assert.equal(2, flag2.given_hyphens);
			assert.equal('delete', flag2.given_label);
			assert.equal('--delete', flag2.name);
			assert.ok(_isPlainObject(flag2.extras));

			var flag3 = args.flags[3];

			assert.ok(clasp.api.isFlag(flag3));
			assert.equal(4, flag3.given_index);
			assert.equal('--x', flag3.given_name);
			assert.ok(null !== flag3.argument_alias);
			assert.equal(2, flag3.given_hyphens);
			assert.equal('x', flag3.given_label);
			assert.equal('--expand', flag3.name);
			assert.ok(_isPlainObject(flag3.extras));

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(0, args.options.length);

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(1, args.values.length);

			assert.equal('value1', args.values[0]);
		});

		it('alias of option with one alias', function() {

			var aliases = [

				clasp.aliases.Option('--verbosity', { alias: '-v' }),
			];

			var argv = [ 'bin/myprog', '-f1', 'value1', '-v=loud' ];
			var args = clasp.api.parse(argv, aliases);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(1, args.flags.length);

			var flag0 = args.flags[0];

			assert.ok(clasp.api.isFlag(flag0));
			assert.equal(0, flag0.given_index);
			assert.equal('-f1', flag0.given_name);
			assert.strictEqual(null, flag0.argument_alias);
			assert.equal(1, flag0.given_hyphens);
			assert.equal('f1', flag0.given_label);
			assert.equal('-f1', flag0.name);
			assert.ok(_isPlainObject(flag0.extras));

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(1, args.options.length);

			var option0 = args.options[0];

			assert.ok(clasp.api.isOption(option0));
			assert.equal(2, option0.given_index);
			assert.equal('-v', option0.given_name);
			assert.ok(null !== option0.argument_alias);
			assert.equal(1, option0.given_hyphens);
			assert.equal('v', option0.given_label);
			assert.equal('--verbosity', option0.name);
			assert.equal('loud', option0.value);
			assert.ok(_isPlainObject(option0.extras));

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(1, args.values.length);

			assert.equal('value1', args.values[0]);
		});

		it('alias of option with separate value', function() {

			var aliases = [

				clasp.aliases.Option('--option', { alias: '-o' }),
			];

			var argv = [ 'bin/myprog', '-o', 'value1' ];
			var args = clasp.api.parse(argv, aliases);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(0, args.flags.length);

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(1, args.options.length);

			var option0 = args.options[0];

			assert.ok(clasp.api.isOption(option0));
			assert.equal(0, option0.given_index);
			assert.equal('-o', option0.given_name);
			assert.ok(null !== option0.argument_alias);
			assert.equal(1, option0.given_hyphens);
			assert.equal('o', option0.given_label);
			assert.equal('--option', option0.name);
			assert.equal('value1', option0.value);
			assert.ok(_isPlainObject(option0.extras));

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(0, args.values.length);
		});

		it('alias of option that has default with separate value', function() {

			var aliases = [

				clasp.aliases.Option('--option', { alias: '-o', default_value: 'def-value-1' }),
			];

			var argv = [ 'bin/myprog', '-o', 'value1' ];
			var args = clasp.api.parse(argv, aliases);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(0, args.flags.length);

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(1, args.options.length);

			var option0 = args.options[0];

			assert.ok(clasp.api.isOption(option0));
			assert.equal(0, option0.given_index);
			assert.equal('-o', option0.given_name);
			assert.ok(null !== option0.argument_alias);
			assert.equal(1, option0.given_hyphens);
			assert.equal('o', option0.given_label);
			assert.equal('--option', option0.name);
			assert.equal('value1', option0.value);
			assert.ok(_isPlainObject(option0.extras));

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(0, args.values.length);
		});

		it('alias of option that has default with separate value that resembles flag', function() {

			var aliases = [

				clasp.aliases.Option('--option', { alias: '-o', default_value: 'def-value-1' }),
			];

			var argv = [ 'bin/myprog', '-o', '-o' ];
			var args = clasp.api.parse(argv, aliases);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(0, args.flags.length);

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(1, args.options.length);

			var option0 = args.options[0];

			assert.ok(clasp.api.isOption(option0));
			assert.equal(0, option0.given_index);
			assert.equal('-o', option0.given_name);
			assert.ok(null !== option0.argument_alias);
			assert.equal(1, option0.given_hyphens);
			assert.equal('o', option0.given_label);
			assert.equal('--option', option0.name);
			assert.equal('-o', option0.value);
			assert.ok(_isPlainObject(option0.extras));

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(0, args.values.length);
		});

		it('alias of option that has default with missing separate value', function() {

			var aliases = [

				clasp.aliases.Option('--option', { alias: '-o', default_value: 'def-value-1' }),
			];

			var argv = [ 'bin/myprog', '-o' ];
			var args = clasp.api.parse(argv, aliases);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(0, args.flags.length);

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(1, args.options.length);

			var option0 = args.options[0];

			assert.ok(clasp.api.isOption(option0));
			assert.equal(0, option0.given_index);
			assert.equal('-o', option0.given_name);
			assert.ok(null !== option0.argument_alias);
			assert.equal(1, option0.given_hyphens);
			assert.equal('o', option0.given_label);
			assert.equal('--option', option0.name);
			assert.equal('def-value-1', option0.value);
			assert.ok(_isPlainObject(option0.extras));

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(0, args.values.length);
		});
	});
});

