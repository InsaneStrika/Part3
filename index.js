const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))
require('dotenv').config()
const Person = require('./models/person')

morgan.token("body", (req, res) => {
    body = req.body
    return JSON.stringify(body);
  });

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons=>{
      res.json(persons)
    })
})

app.get('/info', (req,res)=>{
    const time = new Date(Date.now())
    Person.estimatedDocumentCount({})
    .then((count) => {
      const message =
        `<p>Phonebook has info for ${count} people</p> <p>${time}</p>`
      res.send(message);
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person=>{
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
  
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Missing fields' 
      })
    }
      
    const person = new Person ({
      name: body.name,
      number: body.number
    })
  
    person.save().then(result => {
      console.log(`Added ${body.name} number ${body.number} to phonebook`)
      response.json(result)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})