function cleanEmptyKeys(obj) {
  const objClean = Object.keys(obj)
    .filter((k) => obj[k] !== null || obj[k] !== undefined)
    .reduce((a, k) => ({ ...a, [k]: obj[k] }), {});
  return objClean;
}

module.exports = { cleanEmptyKeys };
