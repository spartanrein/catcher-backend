const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ScoreSchema = new Schema({
    playerName: {type: String, required: true},
    score: {type: Number, required:true}
},{timestamps:true})

const Score = mongoose.model('Score', ScoreSchema)

module.exports = Score