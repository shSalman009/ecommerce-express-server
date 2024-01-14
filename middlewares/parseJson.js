// parse json data
const parseJsonData = (req, res, next) => {
  req.body = JSON.parse(req.body.data);
  next();
};

module.exports = parseJsonData;
