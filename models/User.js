const { Schema, model, Types } = require('mongoose');

// ! TEST EMAIL VALIDATION

// const validateEmail = (email) => {
//     const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//     return regex.test(email);
// }

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: 'You need to provide a username',
            trim: true
        },
        email: {
            type: String,
            required: 'You need to provide an email address',
            unique: true,
            // validate: [validateEmail, 'Please provide a valid email address'],
            // match: [
            //     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            //     'Please provide a valid email address',
            // ],
        },
        thoughts: {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        },
        friends: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

// UserSchema.virtual('friendCount').get(function () {
//     return this.get('friends').length;
// });

const User = model('User', UserSchema)

module.exports = User;