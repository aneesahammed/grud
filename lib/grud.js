/*
 * grud
 * https://github.com/aneesahammed/grud
 *
 * Copyright (c) 2021 Anees Ahammed
 * Licensed under the MIT license.
 */
"use strict";
import "regenerator-runtime/runtime";
import axios from "axios";
import { red as e, green as s } from "chalk";
import _find from "lodash.find";
import _findIndex from "lodash.findIndex";
import _without from "lodash.without";

/**local */
import { UUID, stringify, parse, encode, decode } from "./utils";

let gitHubReposUrl;
let header;

/**
 * Grud class that provides functionality.
 * @class Grud
 */
export default class Grud {
  constructor(config) {
    this.config = {
      protocol: config.protocol || "https",
      host: config.host || "api.github.com",
      pathPrefix: config.pathPrefix || null,
      ...config,
    };

    const {
      protocol,
      host,
      pathPrefix,
      owner,
      repo,
      path,
      personalAccessToken,
    } = this.config;

    if (pathPrefix)
      gitHubReposUrl = `${protocol}://${host}/${pathPrefix}/repos/${owner}/${repo}`;
    else gitHubReposUrl = `${protocol}://${host}/repos/${owner}/${repo}`;

    header = {
      Authorization: "Bearer " + personalAccessToken,
    };

    this.auth();
  }

  /**
   * Checks if owner has write permission to the repo
   */
  async auth() {
    try {
      let { owner } = this.config;
      let uri = `${gitHubReposUrl}/collaborators`;

      let response = await axios.get(uri, {
        headers: header,
      });

      let responseObj = response.data.find((p) => p.login == owner);
      if (responseObj) {
        if (responseObj.permissions.push === true) {
          console.log(s(`[auth]->User has been authenticated successfully!.`));
          return true;
        } else {
          throw new Error("You must have write information to save the data!.");
        }
      }
    } catch (error) {
      throw new Error(error.message || error);
    }
  }

  /**
   * Selects the records  in a collection
   * @param {string} query - Query is optional, it specifies selection filter
   */
  async find(query) {
    let file = await this._getDataStore();
    let collection = parse(file.content);

    if (!query) return collection;

    return _find(collection, query);
  }

  /**
   * Saves blob to repo
   * @param {string} data - Data to be saved
   */
  async save(data) {
    data = parse(stringify(data));

    let collection = [];
    let sha;
    let file = await this._getDataStore();

    if (file) {
      collection = parse(file.content);
      sha = file.sha;
    }

    if (typeof data === "object" && data.length) {
      if (data.length === 1) {
        if (data[0].length > 0) {
          data = data[0];
        }
      }
      for (let i = data.length - 1; i >= 0; i--) {
        let d = data[i];
        d._id = UUID().replace(/-/g, "");
        collection.push(d);
      }
    } else {
      data._id = UUID().replace(/-/g, "");
      collection.push(data);
    }

    await this._write(collection, sha);

    return collection;
  }

  /**
   * Updates the record in repo
   * @param {string} query - Query to filter collection
   * @param {*} data - Data to update
   */
  async update(query, data) {
    let file = await this._getDataStore();
    let collection = parse(file.content);

    let index = _findIndex(collection, query);
    if (index == -1) return collection;

    collection.splice(index, 1, data);

    await this._write(collection, file.sha);
    return collection;
  }

  /**
   * Removes a single document from a collection
   * @param {query} query - Query to filter collection
   */
  async deleteOne(query) {
    try {
      let file = await this._getDataStore();
      const collection = parse(file.content);

      var index = _findIndex(collection, query);
      let records = _without(collection, collection[index]);

      if (index !== -1) {
        await this._write(records, file.sha);
        return records;
      } else {
        throw new Error(`Unable to delete the record, please check the query.`);
      }
    } catch (error) {
      throw new Error(error.message || error);
    }
  }

  /**
   * Gets JSON store contents & current sha tree of passed Github repo
   * @param {object} options - Github options
   */
  async _getDataStore() {
    try {
      const { protocol, host, pathPrefix, owner, repo, path } = this.config;

      let graphQLEndpoint;
      if (pathPrefix) graphQLEndpoint = `${protocol}://${host}/api/graphql`;
      else graphQLEndpoint = `${protocol}://${host}/graphql`;

      var query = JSON.stringify({
        query: `{
        repository(owner: "${owner}", name: "${repo}") {
          object(expression: "HEAD:${path}") {
            ... on Blob {
              sha: oid              
              content: text
            }
          }
        }
      }`,
        variables: {},
      });

      let response = await axios.post(graphQLEndpoint, query, {
        headers: header,
      });

      if (response.status === 200) {
        return parse(stringify(response.data.data.repository.object));
      }
      return null;
    } catch (error) {
      throw new Error(error.message || error);
    }
  }

  /**
   * Writes the data to repo
   * @param {string} data - Data to write
   * @param {*} sha - The blob SHA of the file being replaced
   */
  async _write(data, sha) {
    const { path } = this.config;
    let raw = {
      message: "DATA UPDATE",
      sha: sha,
      branch: "master",
      content: encode(data),
    };

    return await axios.put(`${gitHubReposUrl}/contents/${path}`, raw, {
      headers: header,
    });
  }
}

module.exports = Grud;
