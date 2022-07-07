require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status  - :res[content-length] - :response-time ms :body'));

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
          } else {
            response.status(404).end()
          }
        })
        .catch(error => {
          console.log(error)
          response.status(500).end()
        })
}) 

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        if (persons) {
            response.json(persons)
          } else {
            response.status(404).end()
          }
        })
        .catch(error => {
          console.log(error)
          response.status(500).end()
        })
  })

app.get('/info', (request, response) => {
    const date = new Date
    Person.find({}).then(persons => {
        if (persons) {
        response.send(`phonebook has numbers for ${persons.length} people <p></p> ${date}`)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => {
        console.log(error)
        response.status(500).end()
      })
}) 

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || null) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }

    if (body.number === undefined || null) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    // if (body.name === Person.findByName().then(persons => persons.name)) {
    //     return response.status(400).json({
    //         error: 'name is already exists'
    //     })
    // }

    const person = new Person ({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => {
        console.log(error)
        response.status(500).end()
      })
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;
    Person.deleteOne({_id: id}, (error) => {
     if (error) return next(error);
     response.send({ message: 'Person deleted' });
    });
   });

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})