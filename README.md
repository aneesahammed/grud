<h1 align="center">Welcome to grud 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.6-blue.svg?cacheSeconds=2592000" />
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

> Simple JSON data store in GitHub with CRUD interface for React, Node, Electron and the browser.
> **grud** is a convenient method of storing & performing read, update & delete operations on data without setting up a database server.

### 🏠 [Homepage](https://github.com/aneesahammed/grud#readme)

## Install

```sh
npm install grud
```

## Initialize

To get started with **grud**, initialize the `db` object by passing the required config.

```js
let config = {
  protocol: "https",           //If not passed, defaults to 'https'
  host: "api.github.com",      //If not passed, defaults to 'api.github.com' | In case of Enterprise-GitHub e.g github.snapcircle.net.
  pathPrefix: "",              //Leave empty if you are using github.com | In case of Enterprise-GitHub e.g api/v3
  owner: "username",           //Your GitHub username
  repo: "my-repo",             //Your repository name where you'd like to have your JSON store hosted
  path: "db.json",             //Your data store file with .json extension
  personalAccessToken: "xxxx", //Your personal-access-token with write access
};
let db = new Grud(config);
```

Create your GitHub personal token from [here](https://github.com/settings/tokens).
And please note that **grud** will create a new JSON data store file as mentioned in the `config` (db.json in our case) if the file is not found.<br/>
If the file exists, data shall get appended to the collection array.

# Create

## Create a single record

The following query creates a single `post` record in your JSON dataStore (`db.json`).

```js
const data = {
  author: "Anand",
  title: "sunt aut facere repellat provident ",
  body: "quia et suscipit\nsuscipit recusandae consequuntur ",
};
const posts = await db.save(data);
```

## Create multiple records

The following query creates multiple `post` records in your defined JSON datastore.

```js
const data = [
  {
    author: "Sarath",
    title: "sunt aut facere repellat provident ",
    body: "quia et suscipit\nsuscipit recusandae consequuntur ",
  },
  {
    author: "Anand",
    title: "qui est esse",
    body: "est rerum tempore vitae\nsequi sint nihil",
  },
];
const posts = await db.save(data);
```

# Read

## Get record by Id or unique identifier

The following query returns a single `post` record by unique identifier or Id.

```js
const post = await db.find({ _id: "301b63faac384a31b3e785ebf40295e5" });
```

or

```js
const post = await db.find({ author: "Anand" });
```

## Get all records

The following query returns all `posts` records.

```js
const posts = await db.find();
```

## Update

Update record by Id or unique identifier
The following query finds the `post` record and updates it.

```js
const posts = await db.update(
  { _id: "301b63faac384a31b3e785ebf40295e5" },
  data
);
```

or

```
const posts = await db.update({ author: "Anand" }, data);
```

# Delete

## Delete a single record

The following query deletes a single `post` record.

```js
await db.deleteOne({ _id: "301b63faac384a31b3e785ebf40295e5" });
```

or

```js
await db.deleteOne({ author: "Anand" });
```

## Delete all records

TBA

## Run tests

```sh
npm run test
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/aneesahammed/grud/issues). You can also take a look at the [contributing guide](https://github.com/aneesahammed/grud/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## Limits

**grud** came out from the frequent need of having a database for internal tooling purpose.<br/>
If your priority is to have secure/high-performance storage, you should stick to traditional databases like MongoDB.

## Author

👤 **Anees Ahammed**

- Twitter: [@aneesahammed](https://twitter.com/aneesahammed)

## 📝 License

Copyright © 2021 [Anees Ahammed](https://github.com/aneesahammed).<br />
This project is [MIT](https://github.com/aneesahammed/grud/blob/master/LICENSE) licensed.
