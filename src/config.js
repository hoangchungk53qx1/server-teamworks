const path = require("path");
const rootPath = path.normalize(__dirname + "/..");
const pathPublic = path.join(rootPath + "/public/");
const env = process.env.NODE_ENV || "development";

const config = {
    development: {
      host: "localhost",
      port: 8000,
      root: rootPath,
      public: pathPublic,
      APP_KEY: "1234",
      database: 'electricity',
      username:     'root',
      password: 'Admin123!@#'
    },
    production: {
      host: "http://202.158.246.220",
      port: 8000,
      root: rootPath,
      public:pathPublic,
      APP_KEY: "1234",
      database: 'electricity',
      username:     'admin',
      password: 'Admin123!@#'
    },
  };
module.exports = config[env];
