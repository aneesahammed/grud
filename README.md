<h1 align="center">Welcome to grud 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/aneesahammed/grud#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/aneesahammed/grud/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/aneesahammed/grud/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/aneesahammed/grud" />
  </a>
  <a href="https://twitter.com/aneesahammed" target="_blank">
    <img alt="Twitter: aneesahammed" src="https://img.shields.io/twitter/follow/aneesahammed.svg?style=social" />
  </a>
</p>

> Simple JSON data store in GitHub with CRUD interface for Node, Electron and the browser.

### 🏠 [Homepage](https://github.com/aneesahammed/grud#readme)

## Usage

```sh
npm install grud
```

```js
import Grud from "grud";

let config = {
  protocol: "https", //If not passed, defaults to 'https'
  host: "api.github.com", //If not passed, defaults to 'api.github.com' | In case of Enterprise-GitHub e.g github.snapcircle.net.
  pathPrefix: "", //Leave empty if you are using github.com | In case of Enterprise-GitHub e.g api/v3
  owner: "aneesahammed", //Your GitHub username
  repo: "my-repo", //Your repository name where you'd like to have your JSON store hosted
  path: "db.json", //Any data store file with ext .JSON
  personalAccessToken: "xxxx", //Your personal-access-token with write access
};

// Initialize
let db = new Grud(config);

// Create a post
let post = await db.save(data);

// Read all posts
let post = await db.find();

// Query a post
let post = await db.find({ _id: "301b63faac384a31b3e785ebf40295e5" });

// Update a post
let post = await db.update({ _id: "301b63faac384a31b3e785ebf40295e5" }, data);

// Delete a post
let post = await db.deleteOne({ _id: "301b63faac384a31b3e785ebf40295e5" });
```

## Run tests

```sh
npm run test
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/aneesahammed/grud/issues). You can also take a look at the [contributing guide](https://github.com/aneesahammed/grud/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## Limits

**grud** came out from the frequent need of having a database for internal tooling purpose.<br />
So **grud** is a convenient method of storing data without setting up a database server.
However, if your priority is to have secure/high-performance storage, you should stick to traditional databases like MongoDB.

## Author

👤 **Anees Ahammed**

- Twitter: [@aneesahammed](https://twitter.com/aneesahammed)

## 📝 License

Copyright © 2021 [Anees Ahammed](https://github.com/aneesahammed).<br />
This project is [MIT](https://github.com/aneesahammed/grud/blob/master/LICENSE) licensed.
