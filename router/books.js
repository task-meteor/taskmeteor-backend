const router = require('express').Router();
const { pool } = require('../config')

const getBooks = (request, response) => {
    pool.query('SELECT * FROM test_table', (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).json(results.rows)
    })
}
  
const addBook = (request, response) => {
    const { author, title } = request.body

    pool.query('INSERT INTO test_table (author, title) VALUES ($1, $2)', [author, title], error => {
        if (error) {
        throw error
        }
        response.status(201).json({ status: 'success', message: 'Book added.' })
    })
}

router
  .route('/')
  // GET endpoint
  .get(getBooks)
  // POST endpoint
  .post(addBook)

module.exports = router;