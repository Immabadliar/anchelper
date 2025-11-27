const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const BLOXLINK_API_KEY = 'd5485d28-643e-4ab5-912a-16825148bfe5';
let verifiedUsers = new Map();
let linkedRoblox = new Map();
let actionLogs = [];
let eventLogs = [];
let generalLogs = [];
let warningsMap = new Map();
let guildConfigs = new Map();

async function getLinkedRoblox(discordId, guildId) {
    try {
        const url = `https://api.blox.link/v4/public/guilds/${guildId}/discord-to-roblox/${discordId}`;
        const res = await fetch(url, { headers: { Authorization: BLOXLINK_API_KEY } });
        const data = await res.json();
        if (data.status === 200 && data.robloxId) return data.robloxId;
        return null;
    } catch {
        return null;
    }
}

function parseDuration(str) {
    const match = str.match(/(\d+)(s|m|h|d)/);
    if (!match) return 0;
    const num = parseInt(match[1]);
    const unit = match[2];
    switch (unit) {
        case 's': return num * 1000;
        case 'm': return num * 60 * 1000;
        case 'h': return num * 60 * 60 * 1000;
        case 'd': return num * 24 * 60 * 60 * 1000;
        default: return 0;
    }
}

function embedReply(interaction, title, description) {
    const embed = new EmbedBuilder().setTitle(title).setDescription(description).setColor('Blurple');
    return interaction.reply({ embeds: [embed] }).catch(() => {});
}

module.exports = {
    config: async (interaction) => {
        try {
            const subcommand = interaction.options.getSubcommand();
            const key = interaction.options.getString('key');
            const value = interaction.options.getString('value');
            if (!guildConfigs.has(interaction.guild.id)) guildConfigs.set(interaction.guild.id, {});
            const cfg = guildConfigs.get(interaction.guild.id);
            if (subcommand === 'set') {
                cfg[key] = value;
                embedReply(interaction, 'Config Updated', `${key} = ${value}`);
            } else if (subcommand === 'get') {
                embedReply(interaction, 'Config Value', `${key} = ${cfg[key] || 'not set'}`);
            } else {
                embedReply(interaction, 'Config', 'Config placeholder');
            }
        } catch {
            embedReply(interaction, 'Error', 'Failed to run config');
        }
    },

    serverinfo: async (interaction) => {
        try {
            if (!interaction.member.permissions.has('Administrator')) return embedReply(interaction, 'Error', 'You do not have permission');
            const { guild } = interaction;
            embedReply(interaction, 'Server Info', `Server: ${guild.name}\nMembers: ${guild.memberCount}\nID: ${guild.id}`);
        } catch {}
    },

    ban: async (interaction) => {
        try {
            if (!interaction.member.permissions.has('BanMembers')) return embedReply(interaction, 'Error', 'You do not have permission');
            await interaction.deferReply({ ephemeral: true });
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const member = interaction.guild.members.cache.get(user.id);
            if (!member) return interaction.editReply({ embeds: [new EmbedBuilder().setTitle('Error').setDescription('User not found')] });
            await member.ban({ reason }).catch(() => {});
            actionLogs.push({ action: 'ban', user: user.id, by: interaction.user.id, reason, date: new Date() });
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle('User Banned').setDescription(`Banned ${user.username} for ${reason}`)] });
        } catch {
            try { embedReply(interaction, 'Error', 'Failed to ban user'); } catch {}
        }
    },

    unban: async (interaction) => {
        try {
            if (!interaction.member.permissions.has('BanMembers')) return embedReply(interaction, 'Error', 'You do not have permission');
            await interaction.deferReply({ ephemeral: true });
            const id = interaction.options.getString('userid');
            await interaction.guild.members.unban(id).catch(() => {});
            actionLogs.push({ action: 'unban', user: id, by: interaction.user.id, date: new Date() });
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle('User Unbanned').setDescription(`Unbanned user ID ${id}`)] });
        } catch {
            try { embedReply(interaction, 'Error', 'Failed to unban user'); } catch {}
        }
    },

    kick: async (interaction) => {
        try {
            if (!interaction.member.permissions.has('KickMembers')) return embedReply(interaction, 'Error', 'You do not have permission');
            await interaction.deferReply({ ephemeral: true });
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const member = interaction.guild.members.cache.get(user.id);
            if (!member) return interaction.editReply({ embeds: [new EmbedBuilder().setTitle('Error').setDescription('User not found')] });
            await member.kick(reason).catch(() => {});
            actionLogs.push({ action: 'kick', user: user.id, by: interaction.user.id, reason, date: new Date() });
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle('User Kicked').setDescription(`Kicked **${user.username}** for ${reason}`)] });
        } catch {
            try { embedReply(interaction, 'Error', 'Failed to kick user'); } catch {}
        }
    },

    mute: async (interaction) => embedReply(interaction, 'Mute', 'Config placeholder'),
    gamemute: async (interaction) => embedReply(interaction, 'Game Mute', 'Config placeholder'),
    gamewarn: async (interaction) => embedReply(interaction, 'Game Warn', 'Config placeholder'),
    gamekick: async (interaction) => embedReply(interaction, 'Game Kick', 'Config placeholder'),

    purge: async (interaction) => {
        try {
            if (!interaction.member.permissions.has('ManageMessages')) return embedReply(interaction, 'Error', 'You do not have permission');
            await interaction.deferReply({ ephemeral: true });
            const amount = interaction.options.getInteger('amount');
            const messages = await interaction.channel.messages.fetch({ limit: amount });
            await interaction.channel.bulkDelete(messages).catch(() => {});
            actionLogs.push({ action: 'purge', channel: interaction.channel.id, amount: messages.size, by: interaction.user.id, date: new Date() });
            interaction.editReply({ embeds: [new EmbedBuilder().setTitle('Messages Deleted').setDescription(`Deleted ${messages.size} messages`)] });
        } catch {
            try { embedReply(interaction, 'Error', 'Failed to purge messages'); } catch {}
        }
    },

    verify: async (interaction) => {
        try {
            const robloxId = await getLinkedRoblox(interaction.user.id, interaction.guild.id);
            if (!robloxId) return embedReply(interaction, 'Error', 'Please link your Roblox account first with /linkroblox');
            verifiedUsers.set(interaction.user.id, true);
            embedReply(interaction, 'Verified', `You are now verified! Linked Roblox ID: ${robloxId}`);
        } catch {
            embedReply(interaction, 'Error', 'Failed to verify');
        }
    },

    linkroblox: async (interaction) => {
        try {
            const robloxId = await getLinkedRoblox(interaction.user.id, interaction.guild.id);
            if (!robloxId) return embedReply(interaction, 'Error', 'You have not linked a Roblox account via Bloxlink');
            linkedRoblox.set(interaction.user.id, robloxId);
            embedReply(interaction, 'Roblox Linked', `Linked your Roblox account! ID: ${robloxId}`);
        } catch {
            embedReply(interaction, 'Error', 'Failed to link Roblox');
        }
    },

    unlinkroblox: async (interaction) => {
        try {
            linkedRoblox.delete(interaction.user.id);
            verifiedUsers.delete(interaction.user.id);
            embedReply(interaction, 'Roblox Unlinked', 'Your Roblox account has been unlinked from verification');
        } catch {
            embedReply(interaction, 'Error', 'Failed to unlink Roblox');
        }
    },

    warn: async (interaction) => {
        try {
            if (!interaction.member.permissions.has('KickMembers')) return embedReply(interaction, 'Error', 'You do not have permission');
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const guildId = interaction.guild.id;
            if (!warningsMap.has(guildId)) warningsMap.set(guildId, new Map());
            const guildWarnings = warningsMap.get(guildId);
            if (!guildWarnings.has(user.id)) guildWarnings.set(user.id, []);
            guildWarnings.get(user.id).push({ reason, date: new Date().toISOString(), by: interaction.user.id });
            embedReply(interaction, 'User Warned', `Warned **${user.username}** for ${reason}`);
            actionLogs.push({ action: 'warn', user: user.id, by: interaction.user.id, reason, date: new Date() });
        } catch {
            embedReply(interaction, 'Error', 'Failed to warn user');
        }
    },

    roleassign: async (interaction) => {
        try {
            if (!interaction.member.permissions.has('ManageRoles')) return embedReply(interaction, 'Error', 'You do not have permission');
            await interaction.deferReply({ ephemeral: true });
            const role = interaction.options.getRole('role');
            const user = interaction.options.getUser('user');
            const member = interaction.guild.members.cache.get(user.id);
            if (!member) return embedReply(interaction, 'Error', 'User not found');
            await member.roles.add(role).catch(() => {});
            actionLogs.push({ action: 'roleassign', user: user.id, role: role.id, by: interaction.user.id, date: new Date() });
            embedReply(interaction, 'Role Assigned', `Assigned ${role.name} to ${user.username}`);
        } catch {
            embedReply(interaction, 'Error', 'Failed to assign role');
        }
    },

    removerole: async (interaction) => {
        try {
            if (!interaction.member.permissions.has('ManageRoles')) return embedReply(interaction, 'Error', 'You do not have permission');
            await interaction.deferReply({ ephemeral: true });
            const role = interaction.options.getRole('role');
            const user = interaction.options.getUser('user');
            const member = interaction.guild.members.cache.get(user.id);
            if (!member) return embedReply(interaction, 'Error', 'User not found');
            await member.roles.remove(role).catch(() => {});
            actionLogs.push({ action: 'removerole', user: user.id, role: role.id, by: interaction.user.id, date: new Date() });
            embedReply(interaction, 'Role Removed', `Removed ${role.name} from ${user.username}`);
        } catch {
            embedReply(interaction, 'Error', 'Failed to remove role');
        }
    },

    lock: async (interaction) => {
        try {
            if (!interaction.member.permissions.has('ManageChannels')) return embedReply(interaction, 'Error', 'You do not have permission');
            await interaction.deferReply({ ephemeral: true });
            const channel = interaction.options.getChannel('channel');
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
            actionLogs.push({ action: 'lock', channel: channel.id, by: interaction.user.id, date: new Date() });
            embedReply(interaction, 'Channel Locked', `Locked ${channel.name}`);
        } catch {
            embedReply(interaction, 'Error', 'Failed to lock channel');
        }
    },

    unlock: async (interaction) => {
        try {
            if (!interaction.member.permissions.has('ManageChannels')) return embedReply(interaction, 'Error', 'You do not have permission');
            await interaction.deferReply({ ephemeral: true });
            const channel = interaction.options.getChannel('channel');
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: true });
            actionLogs.push({ action: 'unlock', channel: channel.id, by: interaction.user.id, date: new Date() });
            embedReply(interaction, 'Channel Unlocked', `Unlocked ${channel.name}`);
        } catch {
            embedReply(interaction, 'Error', 'Failed to unlock channel');
        }
    },

    logs: async (interaction) => embedReply(interaction, 'Action Logs', '```json\n' + JSON.stringify(actionLogs.slice(-10), null, 2) + '```'),
    logevents: async (interaction) => embedReply(interaction, 'Event Logs', '```json\n' + JSON.stringify(eventLogs.slice(-10), null, 2) + '```'),
    logactions: async (interaction) => embedReply(interaction, 'Action Logs', '```json\n' + JSON.stringify(actionLogs.slice(-10), null, 2) + '```'),

    track: async (interaction) => embedReply(interaction, 'Track', 'Config placeholder'),
    activity: async (interaction) => embedReply(interaction, 'Activity', 'Config placeholder'),
    rankup: async (interaction) => embedReply(interaction, 'Rank Up', 'Config placeholder'),
    rankdown: async (interaction) => embedReply(interaction, 'Rank Down', 'Config placeholder'),
    setrank: async (interaction) => embedReply(interaction, 'Set Rank', 'Config placeholder'),

    temprole: async (interaction) => {
        try {
            if (!interaction.member.permissions.has('ManageRoles')) return embedReply(interaction, 'Error', 'You do not have permission');
            await interaction.deferReply({ ephemeral: true });
            const role = interaction.options.getRole('role');
            const user = interaction.options.getUser('user');
            const duration = interaction.options.getString('duration');
            const member = interaction.guild.members.cache.get(user.id);
            if (!member) return embedReply(interaction, 'Error', 'User not found');
            await member.roles.add(role).catch(() => {});
            setTimeout(() => member.roles.remove(role).catch(() => {}), parseDuration(duration));
            actionLogs.push({ action: 'temprole', user: user.id, role: role.id, by: interaction.user.id, duration, date: new Date() });
            embedReply(interaction, 'Temporary Role', `Gave ${role.name} to **${user.username}** for ${duration}`);
        } catch {
            embedReply(interaction, 'Error', 'Failed to give temporary role');
        }
    },

    schedule: async (interaction) => embedReply(interaction, 'Schedule', 'Config placeholder'),
    announce: async (interaction) => embedReply(interaction, 'Announce', 'Config placeholder')
};
