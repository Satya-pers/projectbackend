const mongoose = require('mongoose');

const ListSSchema = new mongoose.Schema({
    task: { type: String, required: true },
    dateTime: { type: String, required: true },
    createdAt: { type: String, required: true },
    priority: { type: String,required: true},
    userEmail: { type: String, required: true },
    notified: { type: Boolean, default: false }
}, {
    collection: 'tasks'
});

module.exports = mongoose.model('ListS', ListSSchema);

