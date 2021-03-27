# brackets-toornament-layer

A layer to convert Toornament data to [brackets-viewer.js](https://github.com/Drarig29/brackets-viewer.js) data.

You can use this to view Toornament stages with your own personalized viewer without embedding Toornament's viewer.

[![npm](https://img.shields.io/npm/v/brackets-toornament-layer.svg)](https://www.npmjs.com/package/brackets-toornament-layer)

# How to test

First, do `npm start`. This will generate the database file `db.json`.

To quickly test the results, you can use `json-server`.

```bash
npx json-server db.json
```

Then, open the `/demo/index.html` file from the [brackets-viewer.js](https://github.com/Drarig29/brackets-viewer.js) project.

And tada! You are viewing Toornament data with your own viewer! 🎉

# Credits

This library has been created to be used by the [Nantarena](https://nantarena.net/).
