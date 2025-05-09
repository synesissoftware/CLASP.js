'use strict';

const clasp = require('../index');

const assert = require('assert');
const mstreams = require('memory-streams');

function _isPlainObject(obj) {

	return obj != null && typeof(obj) == "object" && Object.getPrototypeOf(obj) == Object.prototype;
}

describe('clasp.api.parse()', function() {

	describe('with no aliases', function() {

		it('empty argv parses into empty flags, options, values', function() {

			var argv = [ 'bin/myprog' ];
			var args = clasp.api.parse(argv);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(0, args.flags.length);

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(0, args.options.length);

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(0, args.values.length);
		});

		it('one value', function() {

			var argv = [ 'bin/myprog', 'value1' ];
			var args = clasp.api.parse(argv);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(0, args.flags.length);

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(0, args.options.length);

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(1, args.values.length);
			assert.equal('value1', args.values[0]);
		});

		it('two values', function() {

			var argv = [ 'bin/myprog', 'value1', 'value2' ];
			var args = clasp.api.parse(argv);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(0, args.flags.length);

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(0, args.options.length);

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(2, args.values.length);
			assert.equal('value1', args.values[0]);
			assert.equal('value2', args.values[1]);
		});

		it('one flag', function() {

			var argv = [ 'bin/myprog', '-f1' ];
			var args = clasp.api.parse(argv);

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
			assert.equal(0, args.options.length);

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(0, args.values.length);
		});

		it('two flags', function() {

			var argv = [ 'bin/myprog', '-f1', '--flag2' ];
			var args = clasp.api.parse(argv);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(2, args.flags.length);

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
			assert.equal(1, flag1.given_index);
			assert.equal('--flag2', flag1.given_name);
			assert.strictEqual(null, flag1.argument_alias);
			assert.equal(2, flag1.given_hyphens);
			assert.equal('flag2', flag1.given_label);
			assert.equal('--flag2', flag1.name);
			assert.ok(_isPlainObject(flag1.extras));

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(0, args.options.length);

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(0, args.values.length);
		});

		it('three flags', function() {

			var argv = [ 'bin/myprog', '-f1', '--flag2', '---x' ];
			var args = clasp.api.parse(argv);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(3, args.flags.length);

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
			assert.equal(1, flag1.given_index);
			assert.equal('--flag2', flag1.given_name);
			assert.strictEqual(null, flag1.argument_alias);
			assert.equal(2, flag1.given_hyphens);
			assert.equal('flag2', flag1.given_label);
			assert.equal('--flag2', flag1.name);
			assert.ok(_isPlainObject(flag1.extras));

			var flag2 = args.flags[2];

			assert.ok(clasp.api.isFlag(flag2));
			assert.equal(2, flag2.given_index);
			assert.equal('---x', flag2.given_name);
			assert.strictEqual(null, flag2.argument_alias);
			assert.equal(3, flag2.given_hyphens);
			assert.equal('x', flag2.given_label);
			assert.equal('---x', flag2.name);
			assert.ok(_isPlainObject(flag2.extras));

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(0, args.options.length);

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(0, args.values.length);
		});

		it('one option', function() {

			var argv = [ 'bin/myprog', '-o1=v1' ];
			var args = clasp.api.parse(argv);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(0, args.flags.length);

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(1, args.options.length);

			var option0 = args.options[0];

			assert.ok(clasp.api.isOption(option0));
			assert.equal(0, option0.given_index);
			assert.equal('-o1', option0.given_name);
			assert.strictEqual(null, option0.argument_alias);
			assert.equal(1, option0.given_hyphens);
			assert.equal('o1', option0.given_label);
			assert.equal('-o1', option0.name);
			assert.equal('v1', option0.value);
			assert.ok(_isPlainObject(option0.extras));

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(0, args.values.length);
		});

		it('two options', function() {

			var argv = [ 'bin/myprog', '-o1=v1', '--option2=value2' ];
			var args = clasp.api.parse(argv);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(0, args.flags.length);

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(2, args.options.length);

			var option0 = args.options[0];

			assert.ok(clasp.api.isOption(option0));
			assert.equal(0, option0.given_index);
			assert.equal('-o1', option0.given_name);
			assert.strictEqual(null, option0.argument_alias);
			assert.equal(1, option0.given_hyphens);
			assert.equal('o1', option0.given_label);
			assert.equal('-o1', option0.name);
			assert.equal('v1', option0.value);
			assert.ok(_isPlainObject(option0.extras));

			var option1 = args.options[1];

			assert.ok(clasp.api.isOption(option1));
			assert.equal(1, option1.given_index);
			assert.equal('--option2', option1.given_name);
			assert.strictEqual(null, option1.argument_alias);
			assert.equal(2, option1.given_hyphens);
			assert.equal('option2', option1.given_label);
			assert.equal('--option2', option1.name);
			assert.equal('value2', option1.value);
			assert.ok(_isPlainObject(option1.extras));

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(0, args.values.length);
		});

		it('three options', function() {

			var argv = [ 'bin/myprog', '-o1=v1', '--option2=value2', '---the-third-option=the third value' ];
			var args = clasp.api.parse(argv);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(0, args.flags.length);

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(3, args.options.length);

			var option0 = args.options[0];

			assert.ok(clasp.api.isOption(option0));
			assert.equal(0, option0.given_index);
			assert.equal('-o1', option0.given_name);
			assert.strictEqual(null, option0.argument_alias);
			assert.equal(1, option0.given_hyphens);
			assert.equal('o1', option0.given_label);
			assert.equal('-o1', option0.name);
			assert.equal('v1', option0.value);
			assert.ok(_isPlainObject(option0.extras));

			var option1 = args.options[1];

			assert.ok(clasp.api.isOption(option1));
			assert.equal(1, option1.given_index);
			assert.equal('--option2', option1.given_name);
			assert.strictEqual(null, option1.argument_alias);
			assert.equal(2, option1.given_hyphens);
			assert.equal('option2', option1.given_label);
			assert.equal('--option2', option1.name);
			assert.equal('value2', option1.value);
			assert.ok(_isPlainObject(option1.extras));

			var option2 = args.options[2];

			assert.ok(clasp.api.isOption(option2));
			assert.equal(2, option2.given_index);
			assert.equal('---the-third-option', option2.given_name);
			assert.strictEqual(null, option2.argument_alias);
			assert.equal(3, option2.given_hyphens);
			assert.equal('the-third-option', option2.given_label);
			assert.equal('---the-third-option', option2.name);
			assert.equal('the third value', option2.value);
			assert.ok(_isPlainObject(option2.extras));

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(0, args.values.length);
		});

		it('one flag and one option and one value', function() {

			var argv = [ 'bin/myprog', '-f1', 'value1', '--first-option=val1' ];
			var args = clasp.api.parse(argv);

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

		it('double hyphen', function() {

			var argv = [ 'bin/myprog', 'value', '--', '-f2' ];
			var args = clasp.api.parse(argv);

			assert.ok(Array.isArray(args.flags), 'flags property must be an array');
			assert.equal(0, args.flags.length);

			assert.ok(Array.isArray(args.options), 'options property must be an array');
			assert.equal(0, args.options.length);

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(2, args.values.length);

			assert.equal('value', args.values[0]);
			assert.equal('-f2', args.values[1]);
		});

		it('double hyphen and double hyphen', function() {

			var argv = [ 'bin/myprog', '-f1', 'value1', '--', '-f2', '--', '--option1=v1' ];
			var args = clasp.api.parse(argv);

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
			assert.equal(0, args.options.length);

			assert.ok(Array.isArray(args.values), 'values property must be an array');
			assert.equal(4, args.values.length);

			assert.equal('value1', args.values[0]);
			assert.equal('-f2', args.values[1]);
			assert.equal('--', args.values[2]);
			assert.equal('--option1=v1', args.values[3]);
		});
	});
});


/* ///////////////////////////// end of file //////////////////////////// */

