const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json')
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const Schema = mongoose.Schema
const UsersSchema = new Schema(
  {
    name: String,
    password: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
)
const UserModel = mongoose.model('user', UsersSchema)

const connectDb = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://khang2:tHcOGM1Loh6yTpGw@cluster0.cupsw.mongodb.net/test?authSource=admin&replicaSet=atlas-vyloa8-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
    )
    console.log('Connect successful')
  } catch (error) {
    console.log(error)
  }
}
connectDb()

app.get('/', (req, res) => {
  res.send('Hello')
})

app.get('/api/users', async (req, res) => {
  try {
    const user = await UserModel.find()
    res.status(200).send({ user })
  } catch (error) {
    res.send(error)
  }
})

app.post('/api/users', async (req, res) => {
  const { name, password } = req.body
  try {
    const user = await UserModel.create({ name, password })
    res.status(201).send({ success: true, message: 'Ok', user })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message || 'Invalid Server Error',
      error,
    })
  }
})

app.listen(process.env.PORT || 3000)
