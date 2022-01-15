# build-graphql-api

## Description

```build-graphql-api``` allows you to construct an amazing Graphql API with the following built-in features:

 - Typescirpt
 - Typeorm (for database connections)

## Usage

Run the following command:

```
npx build-graphql-api [DIR]
```

## Imporant Information

### Configuring the database

Before starting the api, go to the ```.env``` file in the root directory and enter your database credentials. You can also change the port the server will run on. ***If you do not do this, the api will crash.***

The api uses ```mysql``` be default. To change this, head over to the ```config/db.ts``` file.

### Cors

```cors``` is already taken care of, but if you need to adjust the configuration, for e.g. adding a new origin, head over to the ```src/index.ts``` file.

### Pre-built features

The api comes with 2 fully-functional features built-in: an Author model as well as a Book model. Feel free to delete these if you do not need them.

### Starting the server

Finally, to start the server, run the following command:

```
npm run dev
```

The api uses ```concurrently``` to run the typescript watcher and the nodemon server at the same time.