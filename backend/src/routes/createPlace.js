const crypto = require('crypto');
const dataBaseManager = require('../database/databaseHandler');

module.exports = (req, res) => {
  let data = req.body;
  if (!data) return res.status(400).send('Invalid body, not a json!');

  // validate data
  if (!data.name || !data.description || !data.picture) return res.status(400).send('Invalid body, missing parameters!');

  const dbm = new dataBaseManager();
  const id = crypto.randomUUID();
  const finalDataObject = {
    id: id,
    title: data.name,
    description: data.description,
    picture: data.picture,
  }
  dbm.appendData(finalDataObject);
  return res.json(finalDataObject);
}