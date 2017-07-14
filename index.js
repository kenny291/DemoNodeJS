let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');

let app = express();

app.set('view engine', 'pug');

// DB process
mongoose.connect('mongodb://localhost/mydb', {useMongoClient: true});
let personSchema = mongoose.Schema(
      {
	   name: String,
	   pwd: String,
	}
)
let Person = mongoose.model("Person", personSchema);

// Accept Post
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {res.render('person')});
app.get('/person', (req, res) => {res.render('person');});
app.get('/login', (req, res) => {res.render('login');});
app.get('/all-users', (req, res) => {
	Person.find((err, response) => {
            if(err) res.send("Error in get database");
		else {
                  res.render('all-users', {users: response});
		}
      })
	}
)

// Delete user API
app.delete('/all-users/:name', (req, res) => {
      console.log(req)
      Person.findOneAndRemove(req.params.name, function(err, response){
            if(err)
                  res.json({message: "Error in deleting record name " + req.params.name});
            else
                  res.json({message: "Person with name " + req.params.name + " removed."});
      })
})

// Add user API
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
      })
		
      newPerson.save((err, Person) => {
         if(err){
            console.log(err)
            res.render('show_message', {message: "Database error", type: "error"})
         }
         else
            res.render('show_message', {
               message: "New user added", type: "success", person: personInfo})
      })
   }
}
)
// Hook database
mongoose.connection.on('error', (err) => {
      if (err) console.log("Connect to DB failed")
      }
)
mongoose.connection.on("connected", function(ref) {
      console.log("Connected to DB!");
      app.listen(3000)
      }
)