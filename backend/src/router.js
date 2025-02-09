const express = require('express');
const path = require('path');
const router = express.Router();

const createPlace = require('./routes/createPlace.js');
const getPlaces = require('./routes/getPlaces');
const editPlace = require('./routes/editPlace.js');
const deletePlace = require('./routes/deletePlace.js');

// Serves the frontend
router.use(express.static(path.resolve(__dirname, '..', '..', 'frontend')));

// Create
router.put('/api/newPlace', (req, res) => createPlace(req, res));

// Read
router.get('/api/places', (req, res) => getPlaces(req, res));

// Update
router.patch('/api/editPlace', (req, res) => editPlace(req, res));

// Delete
router.delete('/api/deletePlace', (req, res) => deletePlace(req, res));

module.exports = router;