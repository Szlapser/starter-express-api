const express = require('express')
const app = express()
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('./strategies/discordstrategy')
const db = require('./database/database')
const axios = require('axios')
require('dotenv').config()

db.then( () => {
    console.log('Connected to MongoDB!')
}).catch(err => {console.log(err)})

app.use(session({
    secret: process.env.SESSION,
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false
}))

//passports
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth', passport.authenticate('discord'))

app.get('/auth/redirect', passport.authenticate('discord', {
    failureRedirect: '/forbidden'
}), async (req,res) => { 
    const article = { access_token: req.user.accesToken } 
    const ress = await axios.put('https://discord.com/api/guilds/1080599361622392923/members/' + req.user.discordId, article ,{
        body: {
            access_token: req.user.accesToken
        },
        headers: {
            "Authorization": 'Bot ' + process.env.BOT_TOKEN,
            "Content-Type": "application/json"
        }
    })
    .then(() => {
        console.log('Sent request!')
    })
    
    res.sendStatus(200)
    
})

app.listen(process.env.PORT || 3030, () => {
    console.log('Now listening at port ' + process.env.PORT || 3030)
});