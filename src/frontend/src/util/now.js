// From underscore.js
// https://underscorejs.org/
export default Date.now || function() {
  return new Date().getTime();
};