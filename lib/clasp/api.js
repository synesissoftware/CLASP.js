'use strict';

const clasp_aliases = require('./aliases');

const path = require('path');
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

    this.private_fields = {

      used: false,
    };
  }

  use() {

    this.private_fields['used'] = true;
  }

  toString() {

    return this.name;
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

    this.value = value;
  }

  toString() {

    return this.name + '=' + this.value;
  }
};

class Arguments {

  constructor(argv, specifications, options = {}) {

    this.argv           = argv;
    this.specifications = specifications ? specifications : [];

    var r = _parse(argv, this.specifications);

    this.program_name = r[0];
    this.flags        = r[1];
    this.options      = r[2];
    this.values       = r[3];
  }

  flagIsSpecified(id) {

    return null != this.lookupFlag(id);
  }

  lookupFlag(id) {

    var name = null;

    if (clasp_aliases.isSpecification(id)) {

      name = id.name;
    } else {

      name = String(id);
    }

    for (var i = 0; i != this.flags.length; ++i) {

      var flag = this.flags[i];

      if (flag.name == name) {

        flag.use();

        return flag;
      }
    }

    return null;
  }

  lookupOption(id) {

    var name = null;

    if (clasp_aliases.isSpecification(id)) {

      name = id.name;
    } else {

      name = String(id);
    }

    for (var i = 0; i != this.options.length; ++i) {

      var option = this.options[i];

      if (option.name == name) {

        option.use();

        return option;
      }
    }

    return null;
  }

  getFirstUnusedFlag() {

    for (var i = 0; i != this.flags.length; ++i) {

      var flag = this.flags[i];

      if (false === flag.private_fields['used']) {

        return flag;
      }
    }

    return null;
  }

  getFirstUnusedOption() {

    for (var i = 0; i != this.options.length; ++i) {

      var option = this.options[i];

      if (false === option.private_fields['used']) {

        return option;
      }
    }

    return null;
  }

  getFirstUnusedFlagOrOption() {

    var flag    = this.getFirstUnusedFlag();
    var option  = this.getFirstUnusedOption();

    if (flag) {

      if (option) {

        if (flag.given_index < option.given_index) {

          return flag;
        } else {

          return option;
        }
      } else {

        return flag;
      }
    } else {

      return option;
    }
  }
};

// TODO: rename to `_select_specification()`
function _select_specification(item, specifications) {

  for (var i = 0; i != specifications.length; ++i) {

    var a = specifications[i];

    if (a.name == item) {

      return a;
    }

    for (var j = 0; j != a.aliases.length; ++j) {

      var a2 = a.aliases[j];

      if (a2 == item) {

        return a;
      }
    }
  }

  return null;
}

// TODO: rename to `_select_specifications()`
function _select_specifications(item, specifications) {

  var select_alias = _select_specification(item, specifications);

  if (select_alias) {

    return select_alias;
  }

  var n = item.length - 1;

  if (n > 1) {

    var re  = /^-+([a-zA-Z]+)$/;
    var m   = re.exec(item);

    if (m) {

      var select_aliases = [];

      var gr1 = m[1];

      for (var i = 0; i != gr1.length; ++i) {

        var name = '-' + gr1[i];

        select_alias = _select_specification(name, specifications);

        if (select_alias) {

          var re2 = /(-+)([^=]+)=(.*)$/;
          var m2  = re2.exec(select_alias.name);

          if (m2) {

            var name2               = m2[1] + m2[2];
            var select_option_alias = _select_specification(name2, specifications);

            if (select_option_alias) {

              select_aliases.push([ select_option_alias, select_alias, m2[3] ]);
            }
          } else {

            select_aliases.push(select_alias);
          }
        }
      }

      if (n == select_aliases.length) {

        return select_aliases;
      }
    }
  }

  return null;
}


function _parse(argv, specifications, options = {}) {

  var program_name  = null;
  var flags         = [];
  var options       = [];
  var values        = [];

  if ('program_name' in options) {

    program_name = options['program_name'];
  }

  if (!program_name) {

    program_name = path.basename(process.argv[1]);
  }

  var forced_value    = false;
  var current_option  = null;

  for (var index = 2; index < argv.length; ++index) {

    var arg = argv[index];

    var given_index = index - 2;

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

      var hyphens         = m[1];
      var given_label     = m[2];
      var given_name      = m[0];
      var resolved_name   = given_name;
      var argument_alias  = null;
      var extras          = null;
      var value           = null;
      var is_option       = false;

      if (given_name != arg) {

        value     = arg.slice(1 + given_name.length);
        is_option = true;
      } else {

        var sel_aliases = _select_specifications(arg, specifications);

        if (sel_aliases) {

          var is_aliased = false;

          if (Array.isArray(sel_aliases)) {

            for (var j = 0; j < sel_aliases.length; ++j) {

              var a = sel_aliases[j];

              if (false) {

                ;
              } else if (clasp_aliases.isFlag(a)) {

                var flag = new FlagArgument(arg, given_index, arg, a.name, a, hyphens.length, given_label, a.extras);

                flags.push(flag);

                is_aliased = true;

              } else if (clasp_aliases.isOption(a)) {

                continue;
              } else if (Array.isArray(a)) {

                var soa = a[0];
                var fa  = a[1];
                var v   = a[2];

                var option = new OptionArgument(arg, given_index, arg, soa.name, fa, hyphens.length, given_label, v, extras);

                options.push(option);
              }

              //break;
            }
          }

          if (is_aliased) {

            continue;
          }
        }
      }




      // check aliases

      for (var j = 0; j != specifications.length; ++j) {

        var a = specifications[j];

        if (a.name == given_name || a.aliases.includes(given_name)) {

          is_option       = clasp_aliases.isOption(a);

          resolved_name   = a.name;
          argument_alias  = a;
          extras          = a.extras;

          var hyphens_2       = null;
          var given_label_2   = null;
          var value_2         = null;
          var resolved_name_2 = null;

          var alias_has_value = false;

          var re2 = /^(-+)([^=]+)=(.*)/;
          var m2  = re2.exec(resolved_name);

          if (m2) {

            alias_has_value = true;

            hyphens_2       = m2[1];
            given_label_2   = m2[2];
            value_2         = m2[3];
            resolved_name_2 = hyphens_2 + given_label_2;

            resolved_name   = resolved_name_2;
          }

          if (is_option) {

            // value can be empty string

            if ('' === value) {

              if (alias_has_value) {

                value = value_2;
              }
            }

            if ('' === value) {

              if (a.default_value) {

                value = a.default_value;
              }
            }
          } else {

            if (alias_has_value) {

              is_option = true;
              value     = value_2;
            }
          }

          break;
        }
      }


      // final placement

      if (is_option) {

        var option = new OptionArgument(arg, given_index, given_name, resolved_name, argument_alias, hyphens.length, given_label, value, extras);

        if (null === value) {

          current_option = option;
        } else {

          options.push(option);
        }

      } else {

        var flag = new FlagArgument(arg, given_index, given_name, resolved_name, argument_alias, hyphens.length, given_label, extras);

        flags.push(flag);
      }
    } else {

      values.push(arg);
    }
  }


  if (current_option) {

    value = null;

    var alias = current_option.argument_alias;

    if (alias) {

      if (alias.default_value) {

        current_option.value = alias.default_value;
      }
    }

    options.push(current_option);

    current_option = null;
  }

  return [ program_name, flags, options, values ];
}

function parse_args(argv, specifications = null) {

  return new Arguments(argv, specifications);
}

module.exports.parse = parse_args;

module.exports.isFlag = function(v) {

  return v instanceof FlagArgument;
}

module.exports.isOption = function(v) {

  return v instanceof OptionArgument;
}


/* ///////////////////////////// end of file //////////////////////////// */

