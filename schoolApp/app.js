var express = require("express"),
methodOverride = require("method-override"),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
app         = express();
mongoose.connect("mongodb://localhost/student_app_registry")

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true})); 
app.use(methodOverride("_method"));

var studSchema = new mongoose.Schema({
    name: String,
    age: Number,
    image: String,
    bio: String,
    created:{type:Date, default: Date.now}

});

var Stud = mongoose.model("Stud", studSchema);
// Stud.create({
//     name: "sam",
//     age: 17,
//     image: "http://johnnny.com/kln.jpg",
//     bio: "i like to eat jollof",
    
// });
app.get("/", function(req, res){
    res.redirect("/students");
});

app.get("/students", function(req, res){
    Stud.find({},function(err, studs){
        if (err){
            console.log("error");
        }else{
            res.render("index", {studs: studs});
        }
    }); 
    
});
//create
app.get("/students/new", function(req, res){
    res.render("new"); 
    
});

// post the redirect
app.post("/students", function(req,res){
    Stud.create(req.body.stud, function(err, newStud){
        if (err){
            console.log("error");
        }else{ 
            res.redirect("/students");
        }
    }); 

});


// show route
app.get("/students/:id", function(req,res){
    Stud.findById(req.params.id, function(err, newFound){
        if (err){
            console.log("error");
        }else{
            res.render("show", {stud : newFound});
        }
    });
    
});

app.get("/students/:id/edit", function(req,res){  
    Stud.findById(req.params.id, function(err, editFound){
        if (err){
            console.log("error");
        }else{
            res.render("edit", {stud : editFound});
        }
    });
    
});
// uodated route
app.put("/students/:id/", function(req,res){  
    Stud.findByIdAndUpdate(req.params.id, req.body.stud, function(err, newUpdate){
        if (err){
            console.log("error");
        }else{
            res.redirect("/students/" + req.params.id);
        }
    });
    
});

app.delete("/students/:id", function(req,res){
    Stud.findByIdAndRemove(req.params.id, function(err){
        if (err){
            console.log("error");
        }else{
            res.redirect("/students");
        }
    });
    
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('node server is here,listening port http://%s:%s', host, port);
});