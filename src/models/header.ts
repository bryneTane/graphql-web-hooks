import { DataTypes } from 'sequelize'

export default function Header(sequelize: any) {
  var Header = sequelize.define(
    'header',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      webhookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      tableName: 'header',
      paranoid: true,
    }
  )
  Header.associate = function (models: any) {
    models.header.belongsTo(models.webhook, {
      foreignKey: 'webhookId',
      sourceKey: 'id',
    })
  }
  return Header
}
