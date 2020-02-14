const { Sequelize, DataTypes } = require('sequelize');

async function init(config) {
  const sequelize = new Sequelize('tractor_beam', '', '', {
    dialect: 'sqlite',
    storage: '/data/library.sqlite',
  });

  sequelize.define('Library', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    summary: {
      type: DataTypes.TEXT,
    },
    poster_url: {
      type: DataTypes.TEXT,
    },
    backdrop_url: {
      type: DataTypes.TEXT,
    },
    external_id: {
      type: DataTypes.STRING,
    },
    external_source: {
      type: DataTypes.STRING,
    },
    imdb_id: {
      type: DataTypes.STRING,
    },
  }, { tableName: 'library' });

  await sequelize.sync({ alter: true });
  return sequelize;
}

module.exports = init;