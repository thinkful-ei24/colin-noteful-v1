
const getLogs = (req, res, next) => {
  const now = (new Date()).toLocaleString();
  console.log(`${now} ${req.method} ${req.url}`);
  next();
};

module.exports = { getLogs }
