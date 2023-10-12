const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


morgan.token("body", (request, response) => {
    body = request.body
    return JSON.stringify(body);
  });

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons=>{
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (request,response)=>{
    const time = new Date(Date.now())
    Person.estimatedDocumentCount({})
    .then((count) => {
      const message =
        `<p>Phonebook has info for ${count} people</p> <p>${time}</p>`
      response.send(message);
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person=>{
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id).then(result=>{
      response.status(204).end()
    })
    .catch(error=>next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: body.number })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
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
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})