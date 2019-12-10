'use strict';

angular
    .module('codeChal.taskService', [])
    .service('TaskService', TaskService);

TaskService.$inject = ["$http", "$log"];

/**
 * TaskService for communication with REST API
 *
 * @param $http
 * @param logger
 *
 * @returns {{performTask: performTask}}
 *
 * @constructor
 */
function TaskService($http, logger) {

    logger.debug("+OK - TaskService");

    var service = {
        performTask: performTask
    };

    return service;

    /////////////////////
    // Implementations
    /////////////////////

    // Public functions
    function performTask(data) {
        return $http.put('/tasks', data).then( handleSuccess );
    }

    // Private functions
    function handleSuccess(response) {
        return( response.data );
    }
}