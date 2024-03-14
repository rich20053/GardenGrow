const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;

// Return all plants
const getAll = async (req, res, next) => {
  
  const result = await mongodb.getDb().db("gardengrow").collection('plants').find();
  //console.log(result);
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

// Return one plant by id
const getSingle = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid plant id to retrieve a plant");
    return;
  }

  const plantId = new ObjectId(req.params.id);

  const result = await mongodb.getDb().db("gardengrow").collection('plants').find({ _id: plantId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

// Create one plant from body json
const createPlant = async (req, res, next) => {

  var plantId = new ObjectId;

  /*
  // Find the artist by name
  if (typeof req.body.artist != "undefined") {
    console.log("artist block");
    const artist = req.body.artist;

    var myCursor = await mongodb.getDb().db("gardengrow").collection('plants').find({ name: artist });
    var myDocumentList = myCursor.toArray();

    var myDocument = myDocumentList[0];

    if (typeof myDocument != "undefined") {
      artistId = new ObjectId(myDocument.artist_id);
    }
  }
  else {
    */
    // Use plant id
    categoryId = new ObjectId(req.body.categoryId);
  //}

  // Create an plant
  const plant = {
    name: req.body.name,
    scientific_name: req.body.scientificName,
    category_id: plantId,
    coldestZone: req.body.coldestZone,
    warmestZone: req.body.warmestZone,
    colors: req.body.colors,
    height: req.body.height,
    space: req.body.space,
    daysToGerminate: req.body.daysToGerminate,
    daysToFlower: req.body.daysToFlower,
    daysToHarvest: req.body.daysToHarvest
  };

  // Save Plant in the database
  const result = await mongodb.getDb().db("gardengrow").collection('plants').insertOne(plant);

  if (result.acknowledged) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result.error || 'An error occurred while creating the plant.');
  }
};
  
// Update a single plant
const updatePlant = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid plant id to update a plant");
    return;
  }

  const plantId = new ObjectId(req.params.id);

  // Update a plant
  const plant = {
    name: req.body.name,
    scientific_name: req.body.scientificName,
    category_id: new ObjectId(req.body.category_id),
    coldestZone: req.body.coldestZone,
    warmestZone: req.body.warmestZone,
    colors: req.body.colors,
    height: req.body.height,
    space: req.body.space,
    daysToGerminate: req.body.daysToGerminate,
    daysToFlower: req.body.daysToFlower,
    daysToHarvest: req.body.daysToHarvest
  };

  // Update data in database
  const response = await mongodb.getDb().db("gardengrow").collection('plants').replaceOne({ _id: plantId }, plant);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'An error occurred while updating the plant.');
  }
}; 

// Delete one plant
const deletePlant = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid plant id to update a plant");
    return;
  }

  const plantId = new ObjectId(req.params.id);
  
  const response = await mongodb.getDb().db("gardengrow").collection('plants').deleteOne({ _id: plantId }, true);
  if (response.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(500).json(response.error || 'An error occurred while deleting the plant.');
  }
};

module.exports = { 
  getAll, 
  getSingle, 
  createPlant, 
  updatePlant, 
  deletePlant 
};

