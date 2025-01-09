class BaseHandler {
  try(callback) {
    return async (req, res) => {
      try {
        return await callback(req, res);
      } catch (err) {
        console.log("Hey, there's an error!", err);
        res.status(500).send('Whoops! Sorry, something broke!');
      }
    };
  }
}

module.exports = {
  BaseHandler: BaseHandler,
};
