'use strict';

const clasp = require('../index');

const assert = require('assert');
const mstreams = require('memory-streams');

const util = require('util');

function _isPlainObject(obj) {

  return obj != null && typeof(obj) == "object" && Object.getPrototypeOf(obj) == Object.prototype;
}

describe('clasp.api.parse()', function() {

  describe('combining flags', function() {

    it('flags combined', function() {

      var specifications = [

        clasp.specifications.Flag('--compile', { alias: '-c' }),
        clasp.specifications.Flag('--debug', { alias: '-d' }),
        clasp.specifications.Flag('--execute', { alias: '-e' }),
      ];

      var argv = [ 'bin/myprog', '-ced' ];
      var args = clasp.api.parse(argv, specifications);

      assert.ok(Array.isArray(args.flags), 'flags property must be an array');
      assert.equal(3, args.flags.length);

      var flag0 = args.flags[0];

      assert.ok(clasp.api.isFlag(flag0));
      assert.equal(0, flag0.given_index);
      assert.equal('-ced', flag0.given_name);
      assert.ok(null !== flag0.argument_alias);
      assert.equal(1, flag0.given_hyphens);
      assert.equal('ced', flag0.given_label);
      assert.equal('--compile', flag0.name);
      assert.ok(_isPlainObject(flag0.extras));

      var flag1 = args.flags[1];

      assert.ok(clasp.api.isFlag(flag1));
      assert.equal(0, flag1.given_index);
      assert.equal('-ced', flag1.given_name);
      assert.ok(null !== flag1.argument_alias);
      assert.equal(1, flag1.given_hyphens);
      assert.equal('ced', flag1.given_label);
      assert.equal('--execute', flag1.name);
      assert.ok(_isPlainObject(flag1.extras));

      var flag2 = args.flags[2];

      assert.ok(clasp.api.isFlag(flag2));
      assert.equal(0, flag2.given_index);
      assert.equal('-ced', flag2.given_name);
      assert.ok(null !== flag2.argument_alias);
      assert.equal(1, flag2.given_hyphens);
      assert.equal('ced', flag2.given_label);
      assert.equal('--debug', flag2.name);
      assert.ok(_isPlainObject(flag2.extras));

      assert.ok(Array.isArray(args.options), 'options property must be an array');
      assert.equal(0, args.options.length);

      assert.ok(Array.isArray(args.values), 'values property must be an array');
      assert.equal(0, args.values.length);
    });

    it('flags of flags and options combined', function() {

      var specifications = [

        clasp.specifications.Flag('--compile', { alias: '-c' }),
        clasp.specifications.Flag('--mode=debug', { alias: '-d' }),
        clasp.specifications.Flag('--execute', { alias: '-e' }),
        clasp.specifications.Option('--mode', { alias: '-m' }),
      ];

      var argv = [ 'bin/myprog', '-ced' ];
      var args = clasp.api.parse(argv, specifications);

      assert.ok(Array.isArray(args.flags), 'flags property must be an array');
      assert.equal(2, args.flags.length);

      var flag0 = args.flags[0];

      assert.ok(clasp.api.isFlag(flag0));
      assert.equal(0, flag0.given_index);
      assert.equal('-ced', flag0.given_name);
      assert.ok(null !== flag0.argument_alias);
      assert.equal(1, flag0.given_hyphens);
      assert.equal('ced', flag0.given_label);
      assert.equal('--compile', flag0.name);
      assert.ok(_isPlainObject(flag0.extras));

      var flag1 = args.flags[1];

      assert.ok(clasp.api.isFlag(flag1));
      assert.equal(0, flag1.given_index);
      assert.equal('-ced', flag1.given_name);
      assert.ok(null !== flag1.argument_alias);
      assert.equal(1, flag1.given_hyphens);
      assert.equal('ced', flag1.given_label);
      assert.equal('--execute', flag1.name);
      assert.ok(_isPlainObject(flag1.extras));

      assert.ok(Array.isArray(args.options), 'options property must be an array');
      assert.equal(1, args.options.length);

      var option0 = args.options[0];

      assert.ok(clasp.api.isOption(option0));
      assert.equal(0, option0.given_index);
      assert.equal('-ced', option0.given_name);
      assert.ok(null !== option0.argument_alias);
      assert.equal(1, option0.given_hyphens);
      assert.equal('ced', option0.given_label);
      assert.equal('--mode', option0.name);
      assert.equal('debug', option0.value);
      assert.ok(_isPlainObject(option0.extras));

      assert.ok(Array.isArray(args.values), 'values property must be an array');
      assert.equal(0, args.values.length);
    });

    it('flags of flags and options combined', function() {

      const option_Verbosity  = clasp.specifications.Option('--verbosity', { alias: '-v', help: 'specifies the verbosity', values: [ 'terse', 'quiet', 'silent', 'chatty' ]});
      const flag_Chatty       = clasp.specifications.Flag('--verbosity=chatty', { alias: '-c' });
      const flag_Debug        = clasp.specifications.Flag('--debug', { alias: '-d', help: 'runs in Debug mode' });

      var specifications = [

        flag_Debug,
        option_Verbosity,
        flag_Chatty,

        clasp.specifications.HELP_FLAG,
        clasp.specifications.VERSION_FLAG,
      ];

      var argv = [ 'bin/myprog', '-cd' ];
      var args = clasp.api.parse(argv, specifications);

      assert.ok(Array.isArray(args.flags), 'flags property must be an array');
      assert.equal(1, args.flags.length);

      var flag0 = args.flags[0];

      assert.ok(clasp.api.isFlag(flag0));
      assert.equal(0, flag0.given_index);
      assert.equal('-cd', flag0.given_name);
      assert.ok(null !== flag0.argument_alias);
      assert.equal(1, flag0.given_hyphens);
      assert.equal('cd', flag0.given_label);
      assert.equal('--debug', flag0.name);
      assert.ok(_isPlainObject(flag0.extras));

      assert.ok(Array.isArray(args.options), 'options property must be an array');
      assert.equal(1, args.options.length);

      var option0 = args.options[0];

      assert.ok(clasp.api.isOption(option0));
      assert.equal(0, option0.given_index);
      assert.equal('-cd', option0.given_name);
      assert.ok(null !== option0.argument_alias);
      assert.equal(1, option0.given_hyphens);
      assert.equal('cd', option0.given_label);
      assert.equal('--verbosity', option0.name);
      assert.equal('chatty', option0.value);
      assert.ok(_isPlainObject(option0.extras));

      assert.ok(Array.isArray(args.values), 'values property must be an array');
      assert.equal(0, args.values.length);
    });
  });
});


/* ///////////////////////////// end of file //////////////////////////// */

