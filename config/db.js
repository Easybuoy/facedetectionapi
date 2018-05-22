const mongoose = require('mongoose');

//Map global promises
mongoose.Promise = global.Promise;

//Mongoose connection
mongoose.connect('mongodb://facedetection:WihudyicnufHay8@ds035240.mlab.com:35240/facedetection')
.then(() => {
    console.log('Mongodb connected');
}).catch((err) => {
    console.log(err);
})