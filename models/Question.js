const { response } = require('express');
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({

    question: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    author: {
        type: String,
        required: true,
    },
    answers: [
        {
            author: String, 
            answer : String}
        ] 
});


questionSchema.statics.getAllQuestions = async function() {
    //get and return all questions from mongo DB
    const questions = await this.find({});

    console.log(questions)
    if (questions) {
        return questions;
    }
    throw Error('some error');
}

questionSchema.statics.getSingleQuestion = async function(id) {
    return await this.findById(id);
}

const Question = mongoose.model('question', questionSchema);

module.exports = Question;

/* 
//backup getAllQuestions
questionSchema.statics.getAllQuestions = async function() {
    //get and return all questions from mongo DB
    const questions = await this.find({});

    console.log(questions)
    if (questions) {
        return questions;
    }
    throw Error('some error');
}


*/