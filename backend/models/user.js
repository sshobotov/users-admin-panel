var serverbone = require('serverbone');
var config = require('../config');
var encoder = require('../lib/encoder');

var schema = {
  id: 'schema/user',
  type: 'object',
  properties: {
    id: {
      type: 'integer'
    },
    username: {
      type: 'string',
      required: true,
      sanitize: true
    },
    passwordHash: {
      type: 'string',
    },
    password: {
      type: 'string',
      virtual: true,
      required: true
    },
    roles: {
      type: 'array',
      default: []
    }
  },
  projection: {
    secure: {
      removeFields: ['passwordHash']
    }
  },
  defaultProjectionOptions: {
    projection: 'secure'
  }
};

var User = serverbone.models.ACLModel.extend({
  schema: schema,
  type: 'user',
  db: config.store,
  sync: function(method, model, options) {
    // Due to syncronous validation flow this used to check unique users in DB
    if (method === 'create') {
      return this.db.findAll({ model: User }, { where: { username: model.get('username') } }, function onComplete(error, found) {
        if (found.length) {
          return options.error(new ValidationError('Username ' + model.get('username') + ' is already taken'));
        }
        return config.store.sync.call(this, method, model, options);
      }.bind(this));
    }
    return config.store.sync.call(this, method, model, options);
  },
  
  virtualProperties: {
    password: {
      set: function(key, value, options) {
        // salt value could be generated here and saved as separate field
        this.set('passswordHash', encoder.secureHash(value), options);
      }
    }
  },
  /**
   * @returns {Boolean} true if password was correct, false if not
   */
  checkPassword: function(checkedString) {
    return encoder.secureHash(checkedString) === this.get('passwordHash');
  },

  /**
   * addRoles
   *
   * Roles are unique, thus adding same role twice should not add it to roles twice.
   * Usage:
   * addRoles('a') -> adds role 'a'
   * addRoles('b', 'c') -> adds roles 'b' & 'c'
   * addRoles(['c', 'd', 'e']) -> adds roles 'd' & 'e'
   */
  addRoles: function(roles) {
    if (arguments.length > 1) {
      roles = Array.prototype.slice.call(arguments);
    }
    User.__super__.addRoles.call(this, roles);
  },

  customValidation: function(attrs, options) {
    if (attrs.username.length < 2) {
      return new ValidationError('Username should contain at leats 2 characters.');
    }
    if (attrs.password.length < 6) {
      return new ValidationError('Password should contain at leats 6 characters.');
    }
  }
});

var ValidationError = function(message) {
  this.message = message;
  this.statusCode = this.errorCode = 400;
}
require('util').inherits(ValidationError, Error);

ValidationError.prototype.toJSON = function() {
  return {
    error: 'validation_error',
    error_description: this.message,
    error_code: this.errorCode,
    status: this.statusCode
  };
}

module.exports = User;