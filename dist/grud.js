/*
 * grud
 * https://github.com/aneesahammed/grud
 *
 * Copyright (c) 2021 Anees Ahammed
 * Licensed under the MIT license.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("regenerator-runtime/runtime");

var _axios = _interopRequireDefault(require("axios"));

var _chalk = require("chalk");

var _find3 = _interopRequireDefault(require("lodash/find"));

var _findIndex2 = _interopRequireDefault(require("lodash/findIndex"));

var _without2 = _interopRequireDefault(require("lodash/without"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var gitHubReposUrl;
var header;
/**
 * Grud class that provides functionality.
 * @class Grud
 */

var Grud = /*#__PURE__*/function () {
  function Grud(config) {
    _classCallCheck(this, Grud);

    this.config = _objectSpread({
      protocol: config.protocol || "https",
      host: config.host || "api.github.com",
      pathPrefix: config.pathPrefix || null
    }, config);
    var _this$config = this.config,
        protocol = _this$config.protocol,
        host = _this$config.host,
        pathPrefix = _this$config.pathPrefix,
        owner = _this$config.owner,
        repo = _this$config.repo,
        path = _this$config.path,
        personalAccessToken = _this$config.personalAccessToken;
    if (pathPrefix) gitHubReposUrl = "".concat(protocol, "://").concat(host, "/").concat(pathPrefix, "/repos/").concat(owner, "/").concat(repo);else gitHubReposUrl = "".concat(protocol, "://").concat(host, "/repos/").concat(owner, "/").concat(repo);
    header = {
      Authorization: "Bearer " + personalAccessToken
    };
    this.auth();
  }
  /**
   * Checks if owner has write permission to the repo
   */


  _createClass(Grud, [{
    key: "auth",
    value: function () {
      var _auth = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var owner, uri, response, responseObj;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                owner = this.config.owner;
                uri = "".concat(gitHubReposUrl, "/collaborators");
                _context.next = 5;
                return _axios["default"].get(uri, {
                  headers: header
                });

              case 5:
                response = _context.sent;
                responseObj = response.data.find(function (p) {
                  return p.login == owner;
                });

                if (!responseObj) {
                  _context.next = 15;
                  break;
                }

                if (!(responseObj.permissions.push === true)) {
                  _context.next = 13;
                  break;
                }

                console.log((0, _chalk.green)("[auth]->User has been authenticated successfully!"));
                return _context.abrupt("return", true);

              case 13:
                console.log((0, _chalk.red)("[auth][ERR]->, You must have write information to save data!"));
                return _context.abrupt("return", false);

              case 15:
                _context.next = 20;
                break;

              case 17:
                _context.prev = 17;
                _context.t0 = _context["catch"](0);
                throw Error("[auth][ERR]-> ".concat(_context.t0));

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 17]]);
      }));

      function auth() {
        return _auth.apply(this, arguments);
      }

      return auth;
    }()
    /**
     * Selects the records  in a collection
     * @param {string} query - Query is optional, it specifies selection filter
     */

  }, {
    key: "find",
    value: function () {
      var _find2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(query) {
        var file, collection;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this._getDataStore();

              case 2:
                file = _context2.sent;
                collection = (0, _utils.parse)(file.content);

                if (query) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return", collection);

              case 6:
                return _context2.abrupt("return", (0, _find3["default"])(collection, query));

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function find(_x) {
        return _find2.apply(this, arguments);
      }

      return find;
    }()
    /**
     * Saves blob to repo
     * @param {string} data - Data to be saved
     */

  }, {
    key: "save",
    value: function () {
      var _save = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data) {
        var collection, sha, file, i, d;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                data = (0, _utils.parse)((0, _utils.stringify)(data));
                collection = [];
                _context3.next = 4;
                return this._getDataStore();

              case 4:
                file = _context3.sent;

                if (file) {
                  collection = (0, _utils.parse)(file.content);
                  sha = file.sha;
                }

                if (_typeof(data) === "object" && data.length) {
                  if (data.length === 1) {
                    if (data[0].length > 0) {
                      data = data[0];
                    }
                  }

                  for (i = data.length - 1; i >= 0; i--) {
                    d = data[i];
                    d._id = (0, _utils.UUID)().replace(/-/g, "");
                    collection.push(d);
                  }
                } else {
                  data._id = (0, _utils.UUID)().replace(/-/g, "");
                  collection.push(data);
                }

                _context3.next = 9;
                return this._write(collection, sha);

              case 9:
                return _context3.abrupt("return", collection);

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function save(_x2) {
        return _save.apply(this, arguments);
      }

      return save;
    }()
    /**
     * Updates the record in repo
     * @param {string} query - Query to filter collection
     * @param {*} data - Data to update
     */

  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(query, data) {
        var file, collection, index;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this._getDataStore();

              case 2:
                file = _context4.sent;
                collection = (0, _utils.parse)(file.content);
                index = (0, _findIndex2["default"])(collection, query);
                collection.splice(index, 1, data);
                _context4.next = 8;
                return this._write(collection, file.sha);

              case 8:
                return _context4.abrupt("return", collection);

              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function update(_x3, _x4) {
        return _update.apply(this, arguments);
      }

      return update;
    }()
    /**
     * Removes a single document from a collection
     * @param {query} query - Query to filter collection
     */

  }, {
    key: "deleteOne",
    value: function () {
      var _deleteOne = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(query) {
        var file, collection, index, records;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return this._getDataStore();

              case 3:
                file = _context5.sent;
                collection = (0, _utils.parse)(file.content);
                index = (0, _findIndex2["default"])(collection, query);
                records = (0, _without2["default"])(collection, collection[index]);

                if (!(index !== -1)) {
                  _context5.next = 13;
                  break;
                }

                _context5.next = 10;
                return this._write(records, file.sha);

              case 10:
                return _context5.abrupt("return", records);

              case 13:
                console.log((0, _chalk.red)("[deleteOne][ERR]-> Unable to delete the record, please check the query"));
                return _context5.abrupt("return", "[deleteOne][ERR]-> Unable to delete the record, please check the query");

              case 15:
                _context5.next = 20;
                break;

              case 17:
                _context5.prev = 17;
                _context5.t0 = _context5["catch"](0);
                throw Error("[deleteOne][ERR]-> ".concat(_context5.t0));

              case 20:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 17]]);
      }));

      function deleteOne(_x5) {
        return _deleteOne.apply(this, arguments);
      }

      return deleteOne;
    }()
    /**
     * Gets JSON store contents & current sha tree of passed Github repo
     * @param {object} options - Github options
     */

  }, {
    key: "_getDataStore",
    value: function () {
      var _getDataStore2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var _this$config2, protocol, host, pathPrefix, owner, repo, path, graphQLEndpoint, query, response;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                _this$config2 = this.config, protocol = _this$config2.protocol, host = _this$config2.host, pathPrefix = _this$config2.pathPrefix, owner = _this$config2.owner, repo = _this$config2.repo, path = _this$config2.path;
                if (pathPrefix) graphQLEndpoint = "".concat(protocol, "://").concat(host, "/api/graphql");else graphQLEndpoint = "".concat(protocol, "://").concat(host, "/graphql");
                query = JSON.stringify({
                  query: "{\n        repository(owner: \"".concat(owner, "\", name: \"").concat(repo, "\") {\n          object(expression: \"HEAD:").concat(path, "\") {\n            ... on Blob {\n              sha: oid              \n              content: text\n            }\n          }\n        }\n      }"),
                  variables: {}
                });
                _context6.next = 6;
                return _axios["default"].post(graphQLEndpoint, query, {
                  headers: header
                });

              case 6:
                response = _context6.sent;
                console.log((0, _chalk.green)("[_getDataStore][response]->".concat((0, _utils.stringify)(response.data.data.repository.object))));

                if (!(response.status === 200)) {
                  _context6.next = 10;
                  break;
                }

                return _context6.abrupt("return", (0, _utils.parse)((0, _utils.stringify)(response.data.data.repository.object)));

              case 10:
                return _context6.abrupt("return", null);

              case 13:
                _context6.prev = 13;
                _context6.t0 = _context6["catch"](0);
                console.log((0, _chalk.red)("[ERR]-> ".concat(_context6.t0)));
                throw Error("[ERR]-> ".concat(_context6.t0));

              case 17:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 13]]);
      }));

      function _getDataStore() {
        return _getDataStore2.apply(this, arguments);
      }

      return _getDataStore;
    }()
    /**
     * Writes the data to repo
     * @param {string} data - Data to write
     * @param {*} sha - The blob SHA of the file being replaced
     */

  }, {
    key: "_write",
    value: function () {
      var _write2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(data, sha) {
        var path, raw;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                path = this.config.path;
                raw = {
                  message: "DATA UPDATE",
                  sha: sha,
                  branch: "master",
                  content: (0, _utils.encode)(data)
                };
                _context7.next = 4;
                return _axios["default"].put("".concat(gitHubReposUrl, "/contents/").concat(path), raw, {
                  headers: header
                });

              case 4:
                return _context7.abrupt("return", _context7.sent);

              case 5:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function _write(_x6, _x7) {
        return _write2.apply(this, arguments);
      }

      return _write;
    }()
  }]);

  return Grud;
}();

exports["default"] = Grud;
module.exports = Grud;