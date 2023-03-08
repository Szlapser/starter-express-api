const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    discordId: { type: String, required: true},
    username: { type: String, required: true},
    refreshToken: { type: String, required: true },
    accesToken: { type: String, required: true },
    userEmail: { type: String, reqired: true }
})

const DiscordUser = module.exports = mongoose.model('User', UserSchema);