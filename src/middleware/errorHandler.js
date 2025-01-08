//univeral middleware function for uncaught errors
const ErrorHandler = (error, req, res, next) => {
  console.log("Hey, there's an error!", error);
  res.status(500).send("Sorry! Something's broken!");
};

module.exports = { ErrorHandler };
