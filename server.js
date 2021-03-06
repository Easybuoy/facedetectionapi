const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
//Db config
require('./config/db');
const {User} = require('./models/model');
const {MailLog} = require('./models/model');
const port = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.json('Hi, welcome to WebService');
});

app.get('/users', (req, res) => {
    User.find({}, (err, doc) => {
        if(err){
            res.status(404).json('Unable to retrieve users..Please try again');
        }else if(doc){
            res.json(doc);
        }
    })
});

app.post('/signin', (req, res) =>{
    const {email, password} = req.body;
    if((!email) && (!password)){
        res.status(404).json('Missing required parameter(s)').end();
        return;
    }
    User.findOne({email : email}).lean().exec( (err, doc) => { 
        if(err){
            console.log(err);
            res.status(400).json('Unable to signin...Please try again later').end();
            return;
        }else if(doc){
            const dbpassword = doc.password;
            var match = bcrypt.compareSync(password, dbpassword); // true
            if(match){
                delete doc.password;
                res.json(doc).end();
                return;
            }else{ 
                res.status(403).json('Wrong password. Please input correct password').end();
                return;
            }
        }else{ 
            res.status(404).json('Unable to find User.. Please Try Again').end();
            return;
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
            res.status(400).json(`User already registered with email ${email}`);
        }else{
            const from_email = 'facetetection@gmail.com';
            const to_email = email;
            const subject = 'Registration';
            const content = `Hi ${name}, Thank you for registering on our platform. Hava a nice one. Happy Detecting`;
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
                sendmail(from_email, to_email, subject, content);
                res.json(user);
            })
            .catch(err => res.status(502).json("Unable To Register User. Please Try Again"));
        }
    });
    
    
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    //if found res
    User.findOne({_id: id}).lean().exec((err, doc) => {
        if(err){
            res.status(404).json('Unable to retrieve profile...Please try again');
        }else if(doc){
            delete doc.password;
            res.json(doc);
        }else{
            res.status(400).json('Profile not found');
        }
    });
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    User.findOne({_id: id}).lean().exec((err, doc) => {
        if(err){
            res.status(404).json('Unable to retrieve profile...Please try again');
            return;
        }else if(doc){
            doc.entries++;
           let newentries = doc.entries;
           
            User.update({ _id: id }, { $set: { entries: newentries}}, (err, response) => {
                res.json(`${newentries}`);
                return;
            });
        }else{
            return;
            res.status(400).json('Profile not found');
        }
    });
});


app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

const sendmail = (from_email, to_email, subject, content) => {
    var helper = require('sendgrid').mail;
var from_email = new helper.Email(from_email);
var to_email = new helper.Email(to_email);
var content = new helper.Content('text/plain', content);
var mail = new helper.Mail(from_email, subject, to_email, content);
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON(),
});

sg.API(request, function(error, response) {
    var request = {
        from_email: from_email,
        to_email: to_email,
        subject: subject,
        content: content
    }
    var request = JSON.stringify(request);
    var response = JSON.stringify(response);

    const mailLog = {
        request: request,
        request_time: new Date(),
        response: response,
        response_time: new Date()
    }
    new MailLog(mailLog).save()
    .then((res) => {
        return res;
    })
    .catch((err) => {
        return err;
    });
});
}