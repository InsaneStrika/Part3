const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))

morgan.token("body", (req, res) => {
    body = req.body
    return JSON.stringify(body);
  });


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
      },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
      },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
      },
    {
      id: 4,
      name: "Mary Poppendick",
      number: "39-23-6423122"
    }
  ]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req,res)=>{
    const size = persons.length
    const time = new Date(Date.now())
    res.send(`<p>Phonebook has info for ${size} people</p> <p>${time}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random()*1000)
  }

app.post('/api/persons', (request, response) => {
  
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Missing fields' 
      })
    }
    
    const listed = persons.find(person=>person.name===body.name)

    if(listed) {
      return response.status(400).json({
        error: 'Name already exists'
      })
    }
  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})