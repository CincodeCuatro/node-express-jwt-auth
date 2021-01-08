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
    }

});

//post question

// ge

//COPY OF static method to login user
questionSchema.statics.getQuestions = async function() {
    //get and return all questions from mongo DB
    const questions = await this.GETALL?!?!?!

    if (questions) {
        return questions;
    }
    throw Error('some error');
}

const Question = mongoose.model('question', questionSchema);

module.exports = Question;