const mongoose = require('mongoose');

const YogaModel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    day: {
        type: String,
        default: "0" 
    },
    calories: {
        type: String,
        default: "0" 
    },
    totalCalories: {
        type: String,
        default: "0" 
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "plans",
        default: null 
    }
}, {
    timestamps: true, 
});

const Yoga = mongoose.model('Yogadata', YogaModel);
module.exports = Yoga;
