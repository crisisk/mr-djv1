function createResponse(data = null, meta = {}, success = true) {
  const normalizedMeta = meta && typeof meta === 'object' ? meta : {};

  return {
    success,
    data: typeof data === 'undefined' ? null : data,
    meta: normalizedMeta
  };
}

module.exports = {
  createResponse
};
