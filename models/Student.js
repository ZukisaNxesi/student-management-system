const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: String,
    studentId: String,
    marks: Number,
    attendance: Number
});

module.exports = mongoose.model("Student", studentSchema);