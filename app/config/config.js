module.exports = {
    "server": {
        "port":             3000,
        "swagger_path":     "api/swagger.yaml",
        "controllers_path": "controllers"
    },
    "mongo_db": {
        "url": "mongodb://mongo:27017/test_app",
        "reconnectTries": 3600,
        "reconnectInterval": 1000
    },
    "maria_db": {
        "host":     "mariadb",
        "user":     "npm",
        "port":     3306,
        "password": "npm",
        "database": "npm"
    },
};