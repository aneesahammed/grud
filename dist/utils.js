"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decode = exports.encode = exports.parse = exports.stringify = exports.UUID = void 0;

var _uuid = require("uuid");

/**
 * Creates UUID
 */
var UUID = function UUID() {
  return (0, _uuid.v4)().replace(/-/g, "");
};
/**
 * Returns stringified object
 * @param {string} obj Object to stringify
 */


exports.UUID = UUID;

var stringify = function stringify(obj) {
  return JSON.stringify(obj, null, 2);
};
/**
 * Returns valid Json object from data
 * @param {string} data - Data to parse
 */


exports.stringify = stringify;

var parse = function parse(data) {
  try {
    return JSON.parse(data);
  } catch (err) {
    console.log("[ERR][Not a valid object]->".concat(err));
  }

  return [];
};
/**
 * Encodes string to base64
 * @param {string} data  - String
 */


exports.parse = parse;

var encode = function encode(data) {
  return Buffer.from(JSON.stringify(data)).toString("base64");
};
/**
 * Decodes base64 and returns a string
 * @param {string} data - Base64 encoded data.
 */


exports.encode = encode;

var decode = function decode(data) {
  return Buffer.from(data, "base64").toString("utf8");
};

exports.decode = decode;