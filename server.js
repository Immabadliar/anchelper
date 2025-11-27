const { Client, GatewayIntentBits } = require('discord.js');
const handlers = require('./handlers.js');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const name = interaction.commandName;
    if (!handlers[name]) return;

    await handlers[name](interaction);
});

client.login(process.env.BOT_TOKEN);
