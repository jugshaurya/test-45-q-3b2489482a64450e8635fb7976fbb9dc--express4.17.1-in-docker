const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
});

// Rules
// - mobile number should be of 10 digits and unique
// - email should be unique
// - location should be enum ["Country", "City", "Zip"]
// - status should be enum ["Created", "Contacted"]
// can add time stamp but not required as not given in question
const Lead = sequelize.define(
  "Lead",
  {
    // attributes
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    mobile: {
      type: Sequelize.DOUBLE,
      allowNull: false,
      unique: true,
      validate: {
        isValidPhoneNo: function (value) {
          if (!value) return value;

          var regexp = /^[0-9]+$/;
          var values = Array.isArray(value) ? value : [value];

          values.forEach(function (val) {
            if (!regexp.test(val)) {
              throw new Error("Number only is allowed.");
            }
          });
          return value;
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: {
        args: true,
        msg: "Email address already in use!",
      },
    },
    location_type: {
      type: Sequelize.ENUM,
      values: ["Country", "City", "Zip"],
    },
    status: {
      type: Sequelize.ENUM,
      values: ["Created", "Contacted"],
    },
    location_string: String,
    communication: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: "leads2",
    createdAt: false,
    updatedAt: false,
    freezeTableName: true,
  }
);

module.exports = Lead;
