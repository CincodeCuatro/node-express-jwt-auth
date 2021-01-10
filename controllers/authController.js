const User = require('../models/User');
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');

const jwtSecret = 'uni app secret';

//controller talks to database tells backend what to do
//error handling
const handleErrors = (err) => {
    console.log(err.message,err.code);
    let errors = {email: '', password: ''};

    //incorrect email
    if (err.message === 'email does not exist') {
        errors.email = 'that email is not registered'
    }

        //incorrect password
        if (err.message === 'password does not match') {
            errors.password = 'invalid password'
        }

    //duplicate error code 
    if (err.code === 11000) {
        errors.email = 'That e-mail is already in use';
        return errors;
    }

    //validation errors 
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const maxAge = 3 * 24 * 60 * 60; //3 days in seconds
const createToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req,res) => {
    res.render('signup');
}

module.exports.login_get = (req,res) => {
    res.render('login');
}

module.exports.signup_post = async (req,res) => {
    //console.log(email, password);
   // res.send('new signup');

    const {email, password } = req.body;

    try {
        const user = await User.create({ email, password }); //asynchronus
        const token = createToken(user._id); //uses UID given by mongoDB
        res.cookie('jwt', token, { httpOnly: true , maxAge : maxAge * 1000 });
        res.status(201).json({ user: user._id }); //201 success
    }
    catch(err) {
        const errors = handleErrors(err);
        //console.log(err);
        res.status(400).json({errors}); //failed
    }
}

module.exports.login_post = async (req,res) => {
  //  console.log(req.body);
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id); //uses UID given by mongoDB
        res.cookie('jwt', token, { httpOnly: true , maxAge : maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch (err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}
module.exports.logout_get = (req, res) => {
    //clear the cookie/token
    res.cookie('jwt', '', {maxAge: 1 });
    res.redirect('/');
}

//post Question //todo - author, question, category (from dropdown)
module.exports.question_post = async (req, res) => {
   console.log(req.body);
  
    const { id: userId } = jwt.verify(req.cookies.jwt, jwtSecret);
    console.log(userId);

    const { question, category } = req.body// JSON.parse(req.body);
    console.log(question)
  
    try {
        const user = await User.getUserData(userId);
        const dbRes = await Question.create( { question, category, author: user.email });
        return res.status(201);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send('error, question not created');
    }
}

//note to self: executed when the end point is accessed
module.exports.question_get = async (req, res) => {
    console.log("question_get");

     try {
         //const dbRes = await Question.ques({});
         const questions = await Question.getAllQuestions();
       // console.log(questions);
         return res.status(201).json(questions);
     }
     catch (err) {
         console.log(err);
         return res.status(400).send('error, question not created');
     }
 }


// question_get
// Question.getAll???
// const questions = await Question.getQuestions();
// return res.status(201).json(questions);
//https://www.npmjs.com/package/mongoose
//https://masteringjs.io/tutorials/mongoose/find-by-id