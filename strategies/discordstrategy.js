const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport')
const DiscordUser = require('../models/DiscordUser')

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const CLIENT_REDIRECT = process.env.CLIENT_REDIRECT

passport.serializeUser((user,done) => {
    console.log("Serializing user")
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    const user = await DiscordUser.findById(id)
    if (user){ done(null, user)}
})

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CLIENT_REDIRECT,
    scope: ["identify", "email", "guilds", "guilds.join"]
}, async (accesToken, refreshToken, profile, done) => {
    try {
        const user = await DiscordUser.findOne({ discordId: profile.id })
        if(user) {
            done(null, user)
        } else {
            const newUser = await DiscordUser.create({
                discordId: profile.id,
                username: profile.username,
                refreshToken: refreshToken,
                accesToken: accesToken,
                userEmail: profile.email
            });
            const savedUser = await newUser.save()
            done(null, savedUser)
        }
    } catch(err) {
        console.log(err)
        done(err, null)
    }

    
        
}));

 
