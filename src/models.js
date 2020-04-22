const { Sequelize, DataTypes, UUIDV4 } = require('sequelize')

const sequelize = new Sequelize('sqlite://database.dll')
sequelize.authenticate().then(() => console.log('Ξ Database connected')).catch(console.error)

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  rank: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false
  },
  hmac: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.INTEGER
  },
  address: {
    type: DataTypes.STRING
  }
}, { updatedAt: false })

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user: {
    type: DataTypes.UUID,
    allowNull: false
  },
  route: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  departure: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, { updatedAt: false })

const OrderType = sequelize.define('OrderType', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { updatedAt: false })

const Route = sequelize.define('Route', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  from: {
    type: DataTypes.STRING,
    allowNull: false
  },
  to: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { updatedAt: false })

User.hasMany(Order, { foreignKey: 'user' })
Order.hasOne(User, { foreignKey: 'id' })

Order.hasOne(OrderType, { foreignKey: 'id' })
OrderType.hasMany(Order, { foreignKey: 'type' })

Order.hasOne(Route, { foreignKey: 'id' })
Route.hasMany(Order, { foreignKey: 'route' })

// User.sync({ force: true })
// Order.sync({ force: true })
// OrderType.sync({ force: true })
// Route.sync({ force: true })

module.exports = { User, Order, OrderType, Route }
