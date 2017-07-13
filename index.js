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
);
let Person = mongoose.model("Person", personSchema);

// Accept Post
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));

//Routes
app.get('/', (req, res) => {
	res.render('person')
	}
);
app.get('/person', (req, res) => {
	res.render('person');
	}
);
app.get('/login', (req, res) => {
	res.render('login');
	}
);
app.get('/all-users', (req, res) =>{
	/*Person.find((err, response) => {
			console.log(response)
            if(err) res.send("Error in get database");
			else{
				console.log(response)
				res.render('all-users', {users:response});
			}
      });
	  */
	  res.render('all-users', {users:[{"name": "u1"}]});     
	}
);

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

mongoose.connection.on('error', (err) => {
	if (err)	console.log("Connect to DB failed")
	else	app.listen(3000)
	}
)
