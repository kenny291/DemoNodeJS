/* 
execution: node index.js
ref: https://www.guru99.com/node-js-express.html
     https://www.tutorialspoint.com/nodejs/nodejs_restful_api.htm
*/

let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let things = require('./things.js')

let app = express();

app.set('view engine', 'pug'  );

// DB process
mongoose.connect(process.env.DATABASE, {useMongoClient: true});
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
app.use(express.static('public')); //access http://localhost:3000/img/download.png
app.use('/', things)

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