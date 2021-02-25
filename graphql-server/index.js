const express = require('express')
const path = require('path')
const graphqlHTTP = require('express-graphql')
const sequelize = require('./utils/database')
const schema = require('./graphql/schema')
const resolver = require('./graphql/resolver')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

// app.use(graphqlHTTP({
//   schema: schema,
//   rootValue: resolver,
//   graphiql: true
// }))

async function start() {
  try {
    await sequelize.sync()
    app.listen(PORT, () => {
      console.log('app listen in ' + PORT + ' port!');
    })
  } catch (e) {
    console.log(e)
  }
}

start()