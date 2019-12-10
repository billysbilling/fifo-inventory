'use strict';

let log     = require("../libs/logger")(`Pid: ${process.pid} MariaDb:log`),
    error   = require("../libs/logger")(`Pid: ${process.pid} MariaDb:error`),
    config  = require("../config/config"),
    _       = require("lodash"),
    mariadb = require('mariadb'),
    pool    = mariadb.createPool(config.maria_db);

/**
 * @classdesc Parent class for all models
 *
 * @author Anton Pavlov
 *
 * @requires config
 * @requires lodash
 * @requires mariadb
 */
class Database {

    /**
     * @constructor
     */
    constructor() {
        // pool.on('connection', (conn) => console.log(`connection ${conn.threadId} has been created in pool`));
        // pool.on('acquire', (conn) => console.log(`acquire ${conn.threadId}`));
        // pool.on('enqueue', (conn) => console.log(`enqueue ${conn.threadId}`));
        // pool.on('release', (conn) => console.log(`release ${conn.threadId}`));
    }

    /**
     * Base wrapper for all queries
     *
     * @param  {String} query  - Sql query
     * @param  {Array=} params - Parameters
     *
     * @return {Promise}
     */
    query(query, params = null) {
        return pool.query(query, params);
    }

    /**
     * Base function for getting one row
     *
     * @param  {String} query   Sql query
     * @param  {Array=} params  Parameters
     *
     * @return {Promise}
     */
    fetchOne(query, params = null) {
        return this.query(query, params)
            .then(result => {

                log("+OK - fetchOne. result: %j", result);

                return result[0];
            });
    }

    /**
     * Base function for getting all rows
     *
     * @param  {String} query   Sql query
     * @param  {Array=} params  Parameters
     *
     * @return {Promise}
     */
    fetchAll(query, params = null) {
        return this.query(query, params)
            .then(result => {

                log("+OK - fetchAll. result: %j", result);

                return result;
            });
    }

    /**
     * Base function for executing insert queries
     *
     * @param   {String} table       name
     * @param   {Object} params      Parameters
     *
     * @return {Promise}
     */
    insert(table, params) {
        log("+OK - insert");

        let keys = _.keys(params),
            values = _.values(params),
            nums = [];

        let query = "INSERT INTO "+table+" ( "+keys.join(' ,')+" ) VALUES (";
        for (let i in keys) {
            nums.push('?');
        }

        query += nums.join(' ,');
        query += ')';

        return this.query(query, values)
            .then(result => {

                log("+OK - insert. result: %j", result);

                return result;
            });
    }

    /**
     * Base function for all update queries
     *
     * @param   {String}    table
     * @param   {Object}    setData
     * @param   {Object}    whereEquals
     *
     * @returns {Promise}
     */
    update(table, setData, whereEquals) {
        let iterator = 1;

        let prepareSetRows = function (setData) {
            let values  = [],
                sql     = ' SET ' + _.map(setData, (val, key) => {
                values.push(val);
                return key +' = ?';
            }).join(', ');
            return { values: values, sql: sql };
        };

        let prepareWhereEquals = function (whereEquals) {
            let values  = [],
                sql     = _.map(whereEquals, (val, key) => {
                values.push(val);
                return key +' = ?';
            }, '').join(' AND ');

            return {
                values: values,
                sql: sql ? ' WHERE ' + sql : sql
            };
        };

        let set     = prepareSetRows(setData),
            where   = prepareWhereEquals(whereEquals),
            values  = set.values.concat(where.values);

        log("+OK - update. "+'UPDATE ' + table + ' ' + set.sql + where.sql, values);

        return this.query('UPDATE ' + table + ' ' + set.sql + where.sql, values)
            .then(result => {
                log("+OK - update. result: %j", result);

                return result;
            });
    }

    /**
     * Base function for all delete queries
     *
     * @param   {String}    table
     * @param   {Object}    whereEquals
     *
     * @returns {Promise}
     */
    delete(table, whereEquals) {

        let prepareWhereEquals = function (whereEquals) {
            let values  = [],
                sql     = _.map(whereEquals, (val, key) => {

                if(val instanceof Array) {
                    let val_arr = [];

                    for(let par of val) {
                        values.push(par);
                        val_arr.push('?');
                    }

                    return key + " IN ("+val_arr.join(",")+") ";
                } else if(typeof val === "object") {
                    throw new Error("Parameter must be a string or array "+ JSON.stringify(val, null, 4));
                } else {
                    values.push(val);
                    return key +' = ?';
                }
            }, '').join(' AND ');

            return {
                values: values,
                sql: sql ? ' WHERE ' + sql : sql
            };
        };

        let where = prepareWhereEquals(whereEquals),
            values = where.values;

        log("+OK - delete. " + 'DELETE FROM ' + table + where.sql, values);

        return this.query('DELETE FROM ' + table + where.sql, values)
            .then(result => {

                log("+OK - delete. Result %j", result);

                return result;
            });
    }
}

module.exports = Database;