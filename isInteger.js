module.exports = (x) => {
  let parsed = parseFloat(x);
  return !isNaN(x) && (parsed | 0) === parsed;
}