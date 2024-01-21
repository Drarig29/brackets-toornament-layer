# brackets-toornament-layer

A layer to convert Toornament data to [brackets-viewer.js](https://github.com/Drarig29/brackets-viewer.js) data.

You can use this to view Toornament stages with your own personalized viewer without embedding Toornament's viewer.

[![npm](https://img.shields.io/npm/v/brackets-toornament-layer.svg)](https://www.npmjs.com/package/brackets-toornament-layer)

# Input

You need to give data for **one tournament** at a time.

Toornament API routes needed:

- `/stages` to have the list of stages
- `/bracket-nodes` to have the `source_node_id` property (used to have the `position` property)
- `/matches/{match_id}/games` for each match (if you know you have child matches, i.e. Bo3, Bo5, ...)

The input is constructed as this:

```jsonc
{
    "tournament_id": "4468708049713692672", // Input tournament ID
    "stages": [ 
        // Output of `/stages?tournament_ids=4468708049713692672`
    ],
    "matches": [ 
        // Output of `/matches?stage_ids=618965765764577354,618931468547654563` for round-robin stages 
        // and `/bracket-nodes?tournament_ids=4468708049713692672` for single and double elimination brackets
    ],
    "match_games": [ 
        // Flattened list of all `/matches/{match_id}/games` list results
    ]
}
```

**Note:** If `match_games` is omitted, the `child_count` will be set to

# How to test

First, do `npm start`. This will generate the database file `db.json`.

To quickly test the results, you can use `json-server`.

```bash
npx json-server ./output/db.json
```

Then, open the `./demo/index.html` file from the [brackets-viewer.js](https://github.com/Drarig29/brackets-viewer.js) project.

And tada! You are viewing Toornament data with your own viewer! 🎉

# Credits

This library has been created to be used by the [Nantarena](https://nantarena.net/).
