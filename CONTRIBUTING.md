# Build Proccess

We use [Parcel](https://parceljs.org/ "Parcel") as our module bundler, and have several npm scripts to help you get up and running contributing to the project.

First, make sure you all the dependencies by running

```
npm install
# or yarn
```

Once you make some changes you might find it convenient to test them out in the example (located in `example/`). To do so simply run:

```
npm run watch:example
# or yarn watch:example
```

This will automatically transpile all of the files, bundle them, and start  a dev server.


To build the library for production (so that it can be imported), run:

```
npm run build:lib
# or yarn build:lib
```

This will automatically generate a UMD bundle that can be consumed by CommonJS, AMD, and ES6 Module imports.