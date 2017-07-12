let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');

let app = express();
mongoose.connect('mongodb://localhost/mydb', {useMongoClient: true});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));

let personSchema = mongoose.Schema({
   name: String,
   pwd: String,
});
let Person = mongoose.model("Person", personSchema);
app.set('view engine', 'pug');

app.get('/', function(req, res){
   res.render('person');
});
app.get('/person', function(req, res){
   res.render('person');
});

app.get('/login', function(req, res){
   res.render('login');
});

app.get('/all-users', function(req, res){
      let users = Person.find(function(err, response){console.log(response);});
      res.send(users);
      // console.log(users)
      // res.render('all-users', {users:users});
});

app.post('/person', function(req, res){
   let personInfo = req.body; //Get the parsed information
   console.log(personInfo)

   if(!personInfo.name || !personInfo.pwd){
      res.render('show_message', {
         message: "Sorry, you provided wrong info", type: "error"});
   }
   else {
      let newPerson = new Person({
         name: personInfo.name,
         pwd: personInfo.pwd,
      });
		
      newPerson.save(function(err, Person){
         if(err){
            console.log(err)
            res.render('show_message', {message: "Database error: %s" % err, type: "error"});
         }
         else
            res.render('show_message', {
               message: "New user added", type: "success", person: personInfo});
      });
   }
});

app.listen(3000);
