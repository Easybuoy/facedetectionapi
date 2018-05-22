const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
//Db config
require('./config/db');
const User = require('./models/model');
const port = process.env.PORT || 3001;
const app = express();
// WihudyicnufHay8
app.use(bodyParser.json());
app.use(cors());



app.get('/', (req, res) => {
    res.send('This is working');
});

app.post('/signin', (req, res) =>{
    res.json('sending');
});


app.post('/register', (req, res) => {
    const {name, email, password } = req.body;

    // var hash = bcrypt.hashSync(email);
    // console.log(hash);
   var first = bcrypt.compareSync("ekunolaeasybuoy@gmail.com", '$2a$10$Fjv.oRH7Pll6e7g0E0moq.Qzy0aQxfSivaCrmL87VTmuEP2JbHfIG'); // true
   var second = bcrypt.compareSync("ekunolaeasybuo@gmail.com", '$2a$10$Fjv.oRH7Pll6e7g0E0moq.Qzy0aQxfSivaCrmL87VTmuEP2JbHfIG'); // false
    console.log(first);
    console.log(second);


    User.findOne({email : email}, (err, doc) => {
        if(doc){
            res.status(400).send(`User already registered with email ${email}`);
        }else{
            const NewUser = {
                name: name,
                email: email,
                password: password,
                entries: 0,
                date_joined: new Date()
            }
            new User(NewUser).save()
            .then(user => res.send(user))
            .catch(err => res.status(502).send("Unable To Register. Please Try Again"));
        }
    });
    
    
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    //if found res
    // res.json(user)
    //else
    // res.status(404).json('No user found');
});

app.listen(port, () => {
    console.log(`app is running on port ${port}`);
})