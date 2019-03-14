'use strict';

const clasp = require('../index');

const assert = require('assert');
const mstreams = require('memory-streams');

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

