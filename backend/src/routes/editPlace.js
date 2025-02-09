const DataBaseManager = require('../database/databaseHandler');

module.exports = (req, res) => {
  let data = req.body;
  if (!data) return res.status(400).send('Invalid body, not a json!');

  // validate data
  if (!data.id || !data.name || !data.description || !data.picture) return res.status(400).send('Invalid body, missing parameters!');

  const dbm = new DataBaseManager();
  const places = dbm.readData();
  
  const thePlace = places.findIndex((value) => { return value.id === data.id });
  if (thePlace < 0) return res.status(404).send('Place with provided id doesn\'t exists!');

  places[thePlace].title = data.name;
  places[thePlace].description = data.description;
  places[thePlace].picture = data.picture;

  dbm.writeData(places);
  return res.json(places[thePlace]);
}