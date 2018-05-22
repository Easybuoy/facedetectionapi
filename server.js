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
    res.send('Hi, welcome to WebService');
});

app.get('/users', (req, res) => {
    User.find({}, (err, doc) => {
        if(err){
            res.status(404).send('Unable to retrieve users..Please try again');
        }else if(doc){
            res.send(doc);
        }
    })
});

app.post('/signin', (req, res) =>{
    const {email, password} = req.body;
    //    var first = bcrypt.compareSync("ekunolaeasybuoy@gmail.com", '$2a$10$Fjv.oRH7Pll6e7g0E0moq.Qzy0aQxfSivaCrmL87VTmuEP2JbHfIG'); // true
    User.findOne({email : email}).lean().exec((err, doc) => { 
        if(err){
            res.status(400).send('Unable to signin...Please try again later');
        }else if(doc){
            const dbpassword = doc.password;
            var match = bcrypt.compareSync(password, dbpassword); // true
            if(match){
                delete doc.password;
                res.send(doc);
            }else{
                res.status(403).send('Wrong password. Please input correct password');
            }
        }else{
            res.status(404).send('Unable to find User.. Please Try Again');
        }

    }
);
});


app.post('/register', (req, res) => {
    const {name, email } = req.body;
    let {password} = req.body;
    password = bcrypt.hashSync(password);

    User.findOne({email : email}).lean().exec((err, doc) => {
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
            .then((user) =>{
                delete user.password;
                res.send(user);
            })
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