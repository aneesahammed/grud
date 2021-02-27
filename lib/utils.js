import { v4 } from "uuid";

/**
 * Creates UUID
 */
export const UUID = () => v4().replace(/-/g, "");

/**
 * Returns stringified object
 * @param {string} obj Object to stringify
 */
export const stringify = (obj) => {
  return JSON.stringify(obj, null, 2);
};

/**
 * Returns valid Json object from data
 * @param {string} data - Data to parse
 */
export const parse = (data) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    console.log(`[ERR][Not a valid object]->${err}`);
  }
  return [];
};

/**
 * Encodes string to base64
 * @param {string} data  - String
 */
export const encode = (data) =>
  Buffer.from(JSON.stringify(data)).toString("base64");

/**
 * Decodes base64 and returns a string
 * @param {string} data - Base64 encoded data.
 */
export const decode = (data) => Buffer.from(data, "base64").toString("utf8");
