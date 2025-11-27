const { SlashCommandBuilder } = require('discord.js');

module.exports = [
    new SlashCommandBuilder().setName('config').setDescription('Configure bot settings').addSubcommand(sub=>sub.setName('set').setDescription('Set configuration option')).addSubcommand(sub=>sub.setName('view').setDescription('View configuration')),
    new SlashCommandBuilder().setName('serverinfo').setDescription('Display server information'),

    new SlashCommandBuilder().setName('ban').setDescription('Ban a user').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder().setName('globalban').setDescription('Global ban a user').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder().setName('unban').setDescription('Unban a user').addStringOption(o=>o.setName('userid').setDescription('User ID').setRequired(true)),
    new SlashCommandBuilder().setName('mute').setDescription('Mute a user').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).addStringOption(o=>o.setName('time').setDescription('Time')),
    new SlashCommandBuilder().setName('gamemute').setDescription('Mute a user in-game').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).addStringOption(o=>o.setName('time').setDescription('Time')),
    new SlashCommandBuilder().setName('warn').setDescription('Warn a user').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder().setName('gamewarn').setDescription('Game-warn a user').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder().setName('kick').setDescription('Kick a user').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder().setName('gamekick').setDescription('Kick a user from game').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).addStringOption(o=>o.setName('reason').setDescription('Reason')),
    new SlashCommandBuilder().setName('purge').setDescription('Delete messages').addIntegerOption(o=>o.setName('amount').setDescription('Amount').setRequired(true)),

    new SlashCommandBuilder().setName('verify').setDescription('Start verification'),
    new SlashCommandBuilder().setName('linkroblox').setDescription('Link Roblox account').addStringOption(o=>o.setName('username').setDescription('Roblox Username').setRequired(true)),
    new SlashCommandBuilder().setName('unlinkroblox').setDescription('Unlink Roblox account'),
    new SlashCommandBuilder().setName('roleassign').setDescription('Assign a role').addRoleOption(o=>o.setName('role').setDescription('Role').setRequired(true)).addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)),
    new SlashCommandBuilder().setName('removerole').setDescription('Remove a role').addRoleOption(o=>o.setName('role').setDescription('Role').setRequired(true)).addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)),
    new SlashCommandBuilder().setName('lock').setDescription('Lock channel').addChannelOption(o=>o.setName('channel').setDescription('Channel').setRequired(true)),
    new SlashCommandBuilder().setName('unlock').setDescription('Unlock channel').addChannelOption(o=>o.setName('channel').setDescription('Channel').setRequired(true)),

    new SlashCommandBuilder().setName('logs').setDescription('Logs system').addSubcommand(s=>s.setName('view').setDescription('View logs').addStringOption(o=>o.setName('type').setDescription('Type').setRequired(true))).addSubcommand(s=>s.setName('clear').setDescription('Clear logs').addStringOption(o=>o.setName('type').setDescription('Type').setRequired(true))),
    new SlashCommandBuilder().setName('track').setDescription('Track user activity').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)),
    new SlashCommandBuilder().setName('activity').setDescription('Server activity stats').addStringOption(o=>o.setName('server').setDescription('Server').setRequired(true)),

    new SlashCommandBuilder().setName('logevents').setDescription('Event logging').addSubcommand(s=>s.setName('type').setDescription('Log event type').addStringOption(o=>o.setName('type').setDescription('Type').setRequired(true))).addSubcommand(s=>s.setName('clear').setDescription('Clear event logs').addStringOption(o=>o.setName('type').setDescription('Type').setRequired(true))),
    new SlashCommandBuilder().setName('logactions').setDescription('View bot/admin actions'),

    new SlashCommandBuilder().setName('rankup').setDescription('Promote user').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)),
    new SlashCommandBuilder().setName('rankdown').setDescription('Demote user').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)),
    new SlashCommandBuilder().setName('setrank').setDescription('Set user rank').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).addStringOption(o=>o.setName('rank').setDescription('Rank').setRequired(true)),
    new SlashCommandBuilder().setName('temprole').setDescription('Assign temporary role').addUserOption(o=>o.setName('user').setDescription('User').setRequired(true)).addRoleOption(o=>o.setName('role').setDescription('Role').setRequired(true)).addStringOption(o=>o.setName('duration').setDescription('Duration').setRequired(true)),

    new SlashCommandBuilder().setName('schedule').setDescription('Schedule event').addStringOption(o=>o.setName('event').setDescription('Event').setRequired(true)).addStringOption(o=>o.setName('time').setDescription('Time').setRequired(true)),
    new SlashCommandBuilder().setName('announce').setDescription('Send announcement').addStringOption(o=>o.setName('message').setDescription('Message').setRequired(true))
];
