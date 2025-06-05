const errorHandler = (err, req, res, next) => {
  res.status(500).json({ error: true, message: `Error in ${err.methodName} module: ${err.message}` });
}

export { errorHandler };
