const express = require('express');
let router = express.Router();

// Routes
router.get('/', (req, res) =>  {res.render('person')});
router.get('/person', (req, res) => {res.render('person');});
router.get('/login', (req, res) => {res.render('login');});
router.get('/all-users', (req, res) => {
	res.send("need to handle variable Person");

	// Person.find((err, response) => {
      //       if(err) res.send("Error in get database");
	// 	else {
      //             res.render('all-users', {users: response});
	// 	}
      // })
	// }
// )
})
module.exports = router;