const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

//const newTasks = ["Buy Food", "Cook Food", "Eat Food" ];
//const workTasks = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://admin-jrdenilson:1ffab5@cluster0.ttfhwf2.mongodb.net/todolistDB');

const itemsSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model("Item", itemsSchema);

const todo = new Item({
    name: "Buy Food"
});

const todo1 = new Item({
    name: "Make Food"
});

const todo2 = new Item({
    name: "Eat Food"
});

const defaultItem = [todo, todo1, todo2];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {

    

    Item.find(function (err, newTasks) {

        if (newTasks.length === 0) {
                    Item.insertMany(defaultItem, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully added default items");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {kindOfDay: "Today", addTask: newTasks});
        }   
    });
    
    
});

app.get("/:listName", function (req, res) {
    let nameRoute = _.capitalize(req.params.listName);

    List.findOne({name: nameRoute}, function (err, result) {
        if (!err) {
            if (!result) {
                const list = new List({
                name: nameRoute,
                items: defaultItem
                });

                list.save();  
                res.redirect("/" + nameRoute);
            } else {
                res.render("list", {kindOfDay: result.name, addTask: result.items});
            }
        }
    })
    
    

    

    

});

app.post("/", function (req, res) {
    const item = req.body.newToDo;
    const routeName = req.body.list;

    console.log(routeName);
    const newItem = new Item({
        name: item
    });

    if (routeName === "Today") {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({name: routeName}, function (err, foundList) {
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + routeName);
        })
    }

    
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;


    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function (err) {
        if (!err) {
            console.log("Successfully deleted item!");
            res.redirect("/");
        }
           });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function (err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        } )
    }

    
    
});





app.get("/about", function (req, res) {
    res.render('about');
})






let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
    console.log("Server is running on port 3000!");
})