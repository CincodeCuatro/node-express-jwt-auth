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
     console.log(question)
   
     try {
         const user = await User.getUserData(userId);
         const dbRes = await Question.create( { question, category, author: user.username });
         return res.status(201);
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
         console.log(question)
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
        const {username} = await User.getUserData(userId);
        console.log(username)
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
        console.log(dbRes);
        return res.status(200);
     }
     catch(err) {
         console.error(err);
     }
 }

/*
//Attempt of 'simple' pagination - result: caused buildTable in home.ejs to not find 'length'
module.exports.question_get = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    console.log("question_get");
    

     try {
         //const dbRes = await Question.ques({});
         const questions = await Question.getAllQuestions()
            .limit( limit * 1)
            .skip((page -1) * limit)
            .exec();

            //get total documents in the Questions collection
            const count = await Question.countDocuments();
       // console.log(questions);
       
       //return response with questions, total pages, and current page
        return res.json({
            questions,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
        //  return res.status(201).json(questions);
     }
     catch (err) {
         console.log(err);
         return res.status(400).send('error, question not created');
     }
 }

*/


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