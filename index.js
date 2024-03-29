require('dotenv').config() // Load .env file
const axios = require('axios')
const Discord = require('discord.js')
const { Client, Intents, find } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES] })

function getPrices() {


    // API for price data.
    axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=versagames`).then(res => {
        // If we got a valid response
        if (res.data && res.data[0].current_price && res.data[0].price_change_percentage_24h) {
            let currentPrice = res.data[0].current_price || 0 // Default to zero

            // Price change in percentage ------ for later use if needed
            // let priceChange = res.data[0].price_change_percentage_24h || 0 // Default to zero

            let symbol = res.data[0].symbol || '?'
            // Unix code for arrow pointing up and to the right  let northEastArrow = '\u2197'
            client.user.setPresence({
                activities: [{
                    name: "1 xVERSA ≈ 1.148 VERSA", //`24h: ${priceChange.toFixed(2)}%`
                    type: "WATCHING"
                }]
            })

            client.guilds.cache.find(guild => guild.id === process.env.SERVER_ID).me.setNickname(`$${(symbol).toUpperCase()} | $${(currentPrice).toLocaleString().replace(/,/g, process.env.THOUSAND_SEPARATOR)}`)

            console.log('Updated price to', currentPrice)
        }
        else
            console.log('Could not load player count data for', process.env.COIN_ID)

    }).catch(err => console.log('Error at api.coingecko.com data:', err))
}

// Runs when client connects to Discord.
client.on('ready', () => {
    console.log('Logged in as', client.user.tag)

    getPrices() // Ping server once on startup
    // Ping the server and set the new status message every x minutes. (Minimum of 1 minute)
    setInterval(getPrices, Math.max(1, process.env.PING_FREQUENCY || 1) * 60 * 1000)
})

// Login to Discord
client.login(process.env.TOKEN)