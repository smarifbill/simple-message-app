const { Model, DataTypes, Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  // storage: "../temp.db",
  //create db file in current directory
  storage: "./temp.db",
});

class User extends Model {}
User.init(
  {
    role: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  { sequelize }
);

class Message extends Model {}
Message.init(
  {
    content: DataTypes.STRING,
    //to store likes count
    likes: DataTypes.INTEGER,
    //to store dislikes count
    dislikes: DataTypes.INTEGER,
    time: DataTypes.TIME,
  },
  { sequelize }
);

User.hasMany(Message);
Message.belongsTo(User);

(async () => {
  sequelize.sync({ force: true });
})();

module.exports = {
  User,
  Message,
  sequelize,
};
