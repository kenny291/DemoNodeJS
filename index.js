let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');

let app = express();
mongoose.connect('mongodb://localhost/mydb', {useMongoClient: true});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

let personSchema = mongoose.Schema({
   name: String,
   age: Number,
   nationality: String
});
let Person = mongoose.model("Person", personSchema);
app.set('view engine', 'pug');

app.get('/', function(req, res){
   res.render('person');
});
app.get('/person', function(req, res){
   res.render('person');
});

app.post('/person', function(req, res){
   let personInfo = req.body; //Get the parsed information
   console.log(personInfo)

   if(!personInfo.name || !personInfo.age || !personInfo.nationality){
      res.render('show_message', {
         message: "Sorry, you provided wrong info", type: "error"});
   }
   else {
      let newPerson = new Person({
         name: personInfo.name,
         age: personInfo.age,
         nationality: personInfo.nationality
      });
		
      newPerson.save(function(err, Person){
         if(err){
            console.log(err)
            res.render('show_message', {message: "Database error: %s" % err, type: "error"});
         }
         else
            res.render('show_message', {
               message: "New person added", type: "success", person: personInfo});
      });
   }
});

app.listen(3000);
