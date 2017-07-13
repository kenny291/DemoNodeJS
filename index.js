let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let dbStatus;

let app = express();
mongoose.connect('mongodb://localhost/mydb', {useMongoClient: true});
mongoose.connection.on('error', (err) => {
	console.log("Connect DB failed!")
	dbStatus = false
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));

let personSchema = mongoose.Schema({
   name: String,
   pwd: String,
});
let Person = mongoose.model("Person", personSchema);
app.set('view engine', 'pug');

app.get('/', (req, res) => {
	if (dbStatus == false)
		res.send("Connect to DB failed")
	else
		res.render('person');
});
app.get('/person', (req, res) => {
   res.render('person');
});

app.get('/login', (req, res) => {
   res.render('login');
});

app.get('/all-users', (req, res) => {
      Person.find((err, response) => {
			console.log(response)
            if(err) res.send("Error in get database");
			else{
				console.log(response)
				res.render('all-users', {users:response});
			}
      });
      
});

app.post('/person', (req, res) => {
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
		
      newPerson.save((err, Person) => {
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
