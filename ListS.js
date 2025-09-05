const mongoose = require('mongoose');

const ListSSchema = new mongoose.Schema({
    task: { type: String, required: true },
    dateTime: { type: Date, required: true },  
    createdAt: { type: Date, default: Date.now }, 
    priority: { type: String,required: true},
    userEmail: { type: String, required: true },
    notified: { type: Boolean, default: false }
}, {
    collection: 'tasks'
});

module.exports = mongoose.model('ListS', ListSSchema);

