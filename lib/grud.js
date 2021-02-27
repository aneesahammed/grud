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
import _find from "lodash/find";
import _findIndex from "lodash/findIndex";
import _without from "lodash/without";

/**local */
import { UUID, stringify, parse, encode, decode } from "./utils";

let gitHubReposUrl;
let gitHubApiServer;
let header;

/**
 * Grud class that provides functionality.
 * @class Grud
 */
export default class Grud {
  constructor(config) {
    this.config = config;

    const {
      protocol = "https",
      host = "api.github.com",
      pathPrefix = null,
      owner,
      repo,
      path,
      personalAccessToken,
    } = this.config;

    gitHubApiServer = `${protocol}://${host}`;

    if (pathPrefix)
      gitHubReposUrl = `${protocol}://${host}/${pathPrefix}/repos/${owner}/${repo}`;
    else gitHubReposUrl = `${protocol}://${host}/repos/${owner}/${repo}`;

    header = {
      Authorization: "Bearer " + personalAccessToken,
    };

    console.log(s(`[GitHubURL]->${gitHubReposUrl}`));
    //this.auth();
  }

  /**
   * Checks if owner has write permission to the repo
   */
  async auth() {
    try {
      let { owner } = this.config;
      let uri = `${gitHubReposUrl}/collaborators`;
      console.log(s(`[URI]->${uri}`));

      let response = await axios.get(uri, {
        headers: header,
      });

      let responseObj = response.data.find((p) => p.login == owner);
      if (responseObj) {
        if (responseObj.permissions.push === true) {
          console.log(s(`[auth]->User has been authenticated successfully!`));
          return true;
        } else {
          console.log(
            e(`[auth][ERR]->, You must have write information to save data!`)
          );
          return false;
        }
      }
    } catch (error) {
      throw Error(`[auth][ERR]-> ${error}`);
    }
  }

  /**
   * Selects the records  in a collection
   * @param {string} query - Query is optional, it specifies selection filter
   */
  async find(query) {
    let file = await this._getCurrentFile();
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

    console.log(
      s(`[Sha]->${file.sha} | [Collection]->${stringify(collection)}`)
    );
    await this._write(collection, file.sha);

    return collection;
  }

  /**
   * Updates the record in repo
   * @param {string} query - Query to filter collection
   * @param {*} data - Data to update
   */
  async update(query, data) {
    let file = await this._getCurrentFile();
    let collection = parse(file.content);

    let index = _findIndex(collection, query);
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
      let file = await this._getCurrentFile();
      const collection = parse(file.content);

      var index = _findIndex(collection, query);
      let records = _without(collection, collection[index]);

      if (index !== -1) {
        await this._write(records, file.sha);
        return records;
      } else {
        console.log(
          e(
            `[deleteOne][ERR]-> Unable to delete the record, please check the query`
          )
        );
        return `[deleteOne][ERR]-> Unable to delete the record, please check the query`;
      }
    } catch (error) {
      throw Error(`[deleteOne][ERR]-> ${error}`);
    }
  }

  /**
   * Gets current sha tree of passed Github repo
   * @param {object} options - Github options
   */
  async _getCurrentFile() {
    try {
      const { pathPrefix, owner, repo, path } = this.config;

      let graphQLEndpoint;
      if (pathPrefix) graphQLEndpoint = `${gitHubApiServer}/api/graphql`;
      else graphQLEndpoint = `${gitHubApiServer}/graphql`;
      console.log(s(`[_getCurrentFile][graphQLEndpoint]->${graphQLEndpoint}`));

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

      console.log(
        s(
          `[_getCurrentFile][response]->${stringify(
            response.data.data.repository.object
          )}`
        )
      );

      if (response.status === 200) {
        return parse(stringify(response.data.data.repository.object));
      }
      return null;
    } catch (error) {
      console.log(e(`[ERR]-> ${error}`));
      throw Error(`[ERR]-> ${error}`);
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
