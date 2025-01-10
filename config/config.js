require("dotenv").config();
const pg = require("pg");
module.exports = {
  "development": {
    "username": "PersonalWEB_owner",
    "password": "Igvo1fTrSOR0",
    "database": "PersonalWEB",
    "host": "ep-sparkling-sun-a1g2jz13.ap-southeast-1.aws.neon.tech",
    "dialect": "postgres",
    "dialectModule" : pg,
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  },
  "test": {
    "username": "PersonalWEB_owner",
    "password": "Igvo1fTrSOR0",
    "database": "PersonalWEB",
    "host": "ep-sparkling-sun-a1g2jz13.ap-southeast-1.aws.neon.tech",
    "dialect": "postgres",
    "dialectModule" : pg,
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  },
  "production": {
    "username": "PersonalWEB_owner",
    "password": "Igvo1fTrSOR0",
    "database": "PersonalWEB",
    "host": "ep-sparkling-sun-a1g2jz13.ap-southeast-1.aws.neon.tech",
    "dialect": "postgres",
    "dialectModule" : pg,
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
}
