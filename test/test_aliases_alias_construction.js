'use strict';

const clasp = require('../index');

const assert = require('assert');
const mstreams = require('memory-streams');

describe('clasp.aliases', function() {

	describe('Flag()', function() {

		it('can create a Flag with name and help', function() {

			var flag = clasp.aliases.Flag('--verbose', { help: 'Makes the output verbose', extras: null });

			assert.equal('--verbose', flag.name);
			assert.equal('Makes the output verbose', flag.help);
			assert.ok(Array.isArray(flag.aliases), 'aliases property is not an array');
			assert.equal(0, flag.aliases.length);
			assert.equal(null, flag.extras);
		});

		it('can create a Flag one alias', function() {

			var flag = clasp.aliases.Flag('--verbose', { alias: '-v' });

			assert.equal('--verbose', flag.name);
			assert.equal(null, flag.help);
			assert.ok(Array.isArray(flag.aliases), 'aliases property is not an array');
			assert.equal(1, flag.aliases.length);
			assert.equal('-v', flag.aliases[0]);
			assert.equal(null, flag.extras);
		});
	});

	describe('Option()', function() {

		it('can create a Option with name and help', function() {

			var option = clasp.aliases.Option('--verbose', { help: 'Makes the output verbose', extras: null });

			assert.equal('--verbose', option.name);
			assert.equal('Makes the output verbose', option.help);
			assert.ok(Array.isArray(option.aliases), 'aliases property is not an array');
			assert.equal(0, option.aliases.length);
			assert.equal(null, option.extras);
		});

		it('can create a Option one alias', function() {

			var option = clasp.aliases.Option('--verbose', { alias: '-v' });

			assert.equal('--verbose', option.name);
			assert.equal(null, option.help);
			assert.ok(Array.isArray(option.aliases), 'aliases property is not an array');
			assert.equal(1, option.aliases.length);
			assert.equal('-v', option.aliases[0]);
			assert.equal(null, option.extras);
		});
	});
});

