const User = require('../models/User');
const Question = require('../models/Question');
const jwt = require('jsonwebtoken'); //this is bad because it's duplicated (also in authController.js)
const jwtSecret = 'uni app secret'; //this is bad because it's duplicated (also in authController.js)

//post Question //todo - author, question, category (from dropdown)
module.exports.question_post = async (req, res) => {
    console.log(req.body);
     const { id: userId } = jwt.verify(req.cookies.jwt, jwtSecret);
     console.log(userId);
     const { question, category } = req.body;// JSON.parse(req.body);

     try {
         const user = await User.getUserData(userId);
         const dbRes = await Question.create( { question, category, author: user.username });
        return res.status(201).json({ questionId: dbRes._id });
     }
     catch (err) {
         console.log(err);
         return res.status(400).send('error, question not created');
     }
 }
 
 //backup question_get
 
 module.exports.question_get = async (req, res) => {
     console.log("question_get");
     
 
      try {
          //const dbRes = await Question.ques({});
          const questions = await Question.getAllQuestions();

          const payload = questions.map((question) => ({
              author: question.author,
              category: question.category,
              question: question.question,
              answerCount: question.answers.length,
              _id: question._id
          }));


        // console.log(questions);
          return res.status(201).json(payload);
      }
      catch (err) {
          console.log(err);
          return res.status(400).send('error, question not created');
      }
  }
 
 //get single question and it's answers on a single page
 module.exports.get_single_question = async (req, res) => {
     console.log("single question");
    
     try {
         const question = await Question.getSingleQuestion(req.params.questionId);
         res.render('question', { question });
     }
     catch(err) {
        console.log(err);
        return res.status(400).send('error, question id not found');
     }
 }

 module.exports.post_answer = async (req, res) => {
     console.log("post answer");
     try {
        const { id: userId } = jwt.verify(req.cookies.jwt, jwtSecret);
        const { username } = await User.getUserData(userId);
        const { answer, questionId } = req.body;
        const payload = { 
            answers: [
                { 
                    author: username,
                    answer,
                } 
            ]
            };

        const dbRes = await Question.findOneAndUpdate({_id: questionId  }, { $push: payload } );
        console.log("done posting answer");
        return res.status(200).send("OK");
     }
     catch(err) {
         console.error(err);
     }
 }

//Attempt of 'simple' pagination 
module.exports.question_get_page = async (req, res) => {
    //const { page = 1, limit = 5 } = req.query;

    const limit = 5;
    const page = req.params.index ? req.params.index : 1;
    console.log("question_get_page");
     
     try {
         await Question.find({})
         .skip((limit * page) - limit)
         .limit(limit)
         .exec(function(err, questions) {
            Question.count().exec(function(err, count) {
                if (err) return next(err);

                const payload = questions.map((question) => ({
                    author: question.author,
                    category: question.category,
                    question: question.question,
                    answerCount: question.answers.length,
                    _id: question._id
                }));
 
                res.render('home', {
                    questions: JSON.stringify(payload),
                    current: page,
                    totalPages: Math.ceil(count / limit)
                })
            })
        });       
        
     }
     catch (err) {
         console.log(err);
         return res.status(400).send(err.message);
     }
 }



 
/*
//backup question_get

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


*/




// question_get
// Question.getAll???
// const questions = await Question.getQuestions();
// return res.status(201).json(questions);
//https://www.npmjs.com/package/mongoose
//https://masteringjs.io/tutorials/mongoose/find-by-id