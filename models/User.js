const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter a valid e-mail address'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address'] //uses validator (3rd party) returns true or false
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'The minimum password length is 8 characters']
    },

});

//used in hashing
userSchema.post('save', function(doc, next){

   // console.log('new user was created and saved', doc);
    //next(); //need to call the next method whenever we use any kind of mongoose middleware or hook

    next();
});

//function before doc saves to Database, hashes password with bcrypt
userSchema.pre('save',async function(next) {
    console.log('user about to be created and saved', this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();

})

//static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        //check hashed pw against hashed pw in the db
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
        throw Error('password does not match');
    }
    throw Error('email does not exist');
}

//COPY OF static method to login user
userSchema.statics.getUserData = async function(userId) {
    
    const user = await this.findById(userId); //destructuring javascript
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    
    if (user) {
        return {email: user.email};
    }
    throw Error('user does not exist');
}

const User = mongoose.model('user', userSchema) //must be the singular form for DB

module.exports = User;