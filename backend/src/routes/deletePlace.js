const DataBaseManager = require('../database/databaseHandler');

module.exports = (req, res) => {
  let data = req.body;
  if (!data) return res.status(400).send('Invalid body, not a json!');

  // validate data
  if (!data.id) return res.status(400).send('Invalid body, missing parameters!');

  const dbm = new DataBaseManager();
  const places = dbm.readData();
  
  const thePlace = places.findIndex((value) => { return value.id === data.id });
  if (!thePlace || thePlace < 0) return res.status(418).send('Place with provided id doesn\'t exists!');

  places.splice(thePlace, 1);
  dbm.writeData(places);
  return res.status(200).send('Success!');
};