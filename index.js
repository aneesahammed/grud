/*
 * grud
 * https://github.com/aneesahammed/grud
 *
 * Copyright (c) 2021 Anees Ahammed
 * Licensed under the MIT license.
 */

import axios from "axios";
import { red as e, green as s } from "chalk";
import _find from "lodash/find";
import _findIndex from "lodash/findIndex";
import _without from "lodash/without";

/**local */
import { UUID, stringify, parse, encode, decode } from "./util";

let gitHubApi;
let header;

/**
 * Github class that provides functionality.
 * @class GitHubDb
 */
export default class GitHubDb {
  constructor(config) {
    this.config = config;

    const {
      protocol = "https",
      host = "api.github.com",
      pathPrefix,
      owner,
      repo,
      path,
      personalAccessToken,
    } = config;

    gitHubApi = `${protocol}://${host}/${pathPrefix}/repos/${owner}/${repo}/contents/${path}`;

    header = {
      Authorization: "Bearer " + personalAccessToken,
    };

    console.log(s(`GitHubURL::${gitHubApi}`));
    //this.auth();
  }

  /**
   * Checks if owner has write permission to the repo
   */
  auth = async () => {
    const { protocol, host, pathPrefix, owner, repo } = this.config;
    const uri = `${protocol}://${host}/${pathPrefix}/repos/${owner}/${repo}/collaborators`;

    let response = await axios.get(uri, {
      headers: header,
    });

    let responseObj = response.data.find((p) => p.login == owner);
    if (responseObj) {
      if (responseObj.permissions.push === true)
        console.log(s(`User has been authenticated successfully!`));
      else console.log(e(`ERR, You must have write information to save data!`));
    }
  };

  /**
   * Selects the records  in a collection
   * @param {string} query - Query is optional, it specifies selection filter
   */
  find = async (query) => {
    let file = await this._getCurrentFile();
    let collection = parse(file.content);

    if (!query) return collection;

    return _find(collection, query);
  };

  /**
   * Saves blob to repo
   * @param {string} data - Data to be saved
   */
  save = async (data) => {
    data = parse(stringify(data));

    let file = await this._getCurrentFile();
    let collection = parse(file.content);

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

    console.log(`[Sha]->${file.sha} | [Collection]->${stringify(collection)}`);
    await this._write(collection, file.sha);

    return collection;
  };

  /**
   * Updates the record in repo
   * @param {string} query - Query to filter collection
   * @param {*} data - Data to update
   */
  update = async (query, data) => {
    let file = await this._getCurrentFile();
    let collection = parse(file.content);

    let index = _findIndex(collection, query);
    collection.splice(index, 1, data);

    await this._write(collection, file.sha);
    return collection;
  };

  /**
   * Removes a single documetn from a collection
   * @param {query} query - Query to filter collection
   */
  deleteOne = async (query) => {
    let file = await this._getCurrentFile();
    const collection = parse(file.content);

    var index = _findIndex(collection, query);
    let records = _without(collection, collection[index]);

    if (index !== -1) {
      await this._write(records, file.sha);
      return records;
    } else {
      console.log(
        e(`ERR: Unable to delete the record, please check the query`)
      );
      return `ERR: Unable to delete the record, please check the query`;
    }
  };

  /**
   * Writes the data to repo
   * @param {string} data - Data to write
   * @param {*} sha - The blob SHA of the file being replaced
   */
  _write = async (data, sha) => {
    let raw = {
      message: "DATA UPDATE",
      sha: sha,
      branch: "master",
      content: encode(data),
    };

    return await axios.put(gitHubApi, raw, {
      headers: header,
    });
  };

  /**
   * Gets current sha tree of passed Github repo
   * @param {object} options - Github options
   */
  _getCurrentFile = async () => {
    try {
      const { protocol, host, owner, repo, path } = this.config;
      const graphQLEndpoint = `${protocol}://${host}/api/graphql`;

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

      if (response.statusText == "OK") {
        return parse(stringify(response.data.data.repository.object));
      }
      return null;
    } catch (error) {
      console.log(e("ERR->" + error));
    }
  };
}
