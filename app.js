const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

const newTasks = ["Buy Food", "Cook Food", "Eat Food" ];
const workTasks = [];
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    const currentDay = date.getDate();   

    res.render("list", {kindOfDay: currentDay, addTask: newTasks});


    
});



app.post("/", function (req, res) {
    const item = req.body.newToDo;

     
    if (req.body.list === "Work") {
        workTasks.push(item);
        res.redirect("/work")
    } else {
        newTasks.push(item)
        res.redirect("/")
    }
    
})


app.get("/work", function (res, res) {
    
    res.render("list", {kindOfDay: "Work List", addTask: workTasks});

})


app.get("/about", function (req, res) {
    res.render('about');
})








app.listen(3000, function () {
    console.log("Server is running on port 3000!");
})