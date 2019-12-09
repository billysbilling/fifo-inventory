'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('transactions', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    prod_id: {
      type: 'int',
      notNull: true
    },
    quantity: {
      type: 'int',
      notNull: true
    },
    price_per_item: {
      type: 'int',
      notNull: true
    },
    total_cost: {
      type: 'int',
      notNull: true
    },
    date: {
      type: 'datetime',
      notNull: true,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    type: {
      type: 'string', // buy or sell
      length: 100,
      notNull: true
    }
  }, function(err) {
    if (err) return callback(err);
    return callback();
  });
};

exports.down = function(db, callback) {
  db.dropTable('transactions', callback);
};

exports._meta = {
  "version": 1
};
