require("dotenv").config({ path: 'ENV_FILENAME' });
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Character = require("./characters");
const cors = require("cors");

app.use(express.urlencoded({
    extended: true
}));
app.use(cors());

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

app.get("/", (req, res) => {
    res.send("Welcome by ringsify");
});

app.route("/characters/:id")
    .get((req, res) => {
        const id = req.params.id;
        Character.findOne({ _id: id }, function (err, character) {
            if (err) {
                res.json({ "error": err });
            } else {
                if (character) {
                    res.json(character);
                } else {
                    res.json({ "Empty": "No character found on this id" });
                }
            }
        });
    })
    .delete((req, res) => {
        const id = req.params.id;
        Character.deleteOne({ _id: id }, function (err, character) {
            if (err) {
                res.json({ "error": err });
            } else {
                if (character) {
                    res.json({ "Successful deleted": "Character is deleted!" });
                } else {
                    res.json({ "Empty": "No character found on this id" });
                }
            }
        })
    })
    .patch((req, res) => {
        const id = req.params.id;
        Character.updateOne({ _id: id }, function (err, character) {
            if (err) {
                res.json({ "error": err });
            } else {
                if (character) {
                    res.json({ "Successful edit": "Character is updated! " })
                } else {
                    res.json({ "Empty": "No character found on this id" });
                }
            }
        });
    });

app.route("/characters")
    //Get all characters from database.
    .get(async (req, res) => {
        let page;
        let limit;
        let startIndex;
        let sort;
        let nameCharacter;
        let raceCharacter;
        let realmCharacter;
        let cultureCharacter;
        const results = {};

        if (req.query.page != null && req.query.limit != null) {
            // Pagination
            page = parseInt(req.query.page);
            limit = parseInt(req.query.limit);

            startIndex = (page - 1) * limit;
        }

        if (req.query.sort != null) {
            sort = parseInt(req.query.sort);
        }

        if (req.query.race != null) {
            raceCharacter = { race: req.query.race };
        } else {
            raceCharacter = {};
        }

        if (req.query.name != null) {
            nameCharacter = { name: req.query.name };
        } else {
            nameCharacter = {};
        }

        if (req.query.realm != null) {
            realmCharacter = { realm: req.query.realm };
        } else {
            realmCharacter = {};
        }

        if (req.query.culture != null) {
            cultureCharacter = { culture: req.query.culture };
        } else {
            cultureCharacter = {};
        }

        let filter = { "$and": [nameCharacter, raceCharacter, realmCharacter, cultureCharacter] };


        console.log(filter);

        try {
            results.results = await Character.find(filter).limit(limit).skip(startIndex).sort({ name: sort }).exec();
            res.json(results);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }

    })
    .post((req, res) => {
        const character = new Character({
            name: req.body.name,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            race: req.body.race,
            birth: req.body.birth,
            death: req.body.death,
            realm: req.body.realm,
            culture: req.body.culture,
            fandomUrl: req.body.fandomUrl,
        });

        character.save((err) => {
            if (err) {
                res.jsont({ "Error": err.message });
            } else {
                res.json({ "Successful added": "Successful added a new character!" });
            }
        });
    });

app.listen(process.env.PORT || 3000, () => {
    console.log("Server runs on port 3000");
});