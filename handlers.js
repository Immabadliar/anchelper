let verifiedUsers = new Map();

module.exports = {
    config: async (interaction) => {
        interaction.reply('Config placeholder');
    },

    serverinfo: async (interaction) => {
        if (!interaction.member.permissions.has('Administrator')) return interaction.reply('You do not have permission');
        const { guild } = interaction;
        interaction.reply(`Server: ${guild.name}\nMembers: ${guild.memberCount}\nID: ${guild.id}`);
    },

    ban: async (interaction) => {
        if (!interaction.member.permissions.has('BanMembers')) return interaction.reply('You do not have permission');
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(user.id);
        if (!member) return interaction.editReply('User not found in server');
        await member.ban({ reason }).catch(() => {});
        interaction.editReply(`Banned ${user.username} for ${reason}`);
    },

    globalban: async (interaction) => {
        interaction.reply('Config placeholder');
    },

    unban: async (interaction) => {
        if (!interaction.member.permissions.has('BanMembers')) return interaction.reply('You do not have permission');
        await interaction.deferReply({ ephemeral: true });
        const id = interaction.options.getString('userid');
        await interaction.guild.members.unban(id).catch(() => {});
        interaction.editReply(`Unbanned user ID ${id}`);
    },

    mute: async (interaction) => {
        if (!interaction.member.permissions.has('MuteMembers')) return interaction.reply('You do not have permission');
        interaction.reply('Config placeholder');
    },

    gamemute: async (interaction) => {
        interaction.reply('Config placeholder');
    },

    warn: async (interaction) => {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason';
        const warnings = interaction.guild.members.cache.get(user.id)?.getAttribute?.('warnings') || [];
        warnings.push({ reason, date: new Date().toISOString() });
        if (interaction.guild.members.cache.get(user.id)?.setAttribute) interaction.guild.members.cache.get(user.id).setAttribute('warnings', warnings);
        interaction.reply(`Warned ${user.username} for ${reason}`);
    },

    gamewarn: async (interaction) => {
        interaction.reply('Config placeholder');
    },

    kick: async (interaction) => {
        if (!interaction.member.permissions.has('KickMembers')) return interaction.reply('You do not have permission');
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(user.id);
        if (!member) return interaction.editReply('User not found in server');
        await member.kick(reason).catch(() => {});
        interaction.editReply(`Kicked ${user.username} for ${reason}`);
    },

    gamekick: async (interaction) => {
        interaction.reply('Config placeholder');
    },

    purge: async (interaction) => {
        if (!interaction.member.permissions.has('ManageMessages')) return interaction.reply('You do not have permission');
        await interaction.deferReply({ ephemeral: true });
        const amount = interaction.options.getInteger('amount');
        const messages = await interaction.channel.messages.fetch({ limit: amount });
        await interaction.channel.bulkDelete(messages).catch(() => {});
        interaction.editReply(`Deleted ${messages.size} messages`);
    },


    verify: async (interaction) => {
        verifiedUsers.set(interaction.user.id, true);
        interaction.reply('You are now verified!');
    },


    linkroblox: async (interaction) => interaction.reply('Config placeholder'),

    unlinkroblox: async (interaction) => interaction.reply('Config placeholder'),

    roleassign: async (interaction) => {
        if (!interaction.member.permissions.has('ManageRoles')) return interaction.reply('You do not have permission');
        await interaction.deferReply({ ephemeral: true });
        const role = interaction.options.getRole('role');
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        if (!member) return interaction.editReply('User not found');
        await member.roles.add(role).catch(() => {});
        interaction.editReply(`Assigned ${role.name} to ${user.username}`);
    },

    removerole: async (interaction) => {
        if (!interaction.member.permissions.has('ManageRoles')) return interaction.reply('You do not have permission');
        await interaction.deferReply({ ephemeral: true });
        const role = interaction.options.getRole('role');
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        if (!member) return interaction.editReply('User not found');
        await member.roles.remove(role).catch(() => {});
        interaction.editReply(`Removed ${role.name} from ${user.username}`);
    },

    lock: async (interaction) => {
        if (!interaction.member.permissions.has('ManageChannels')) return interaction.reply('You do not have permission');
        await interaction.deferReply({ ephemeral: true });
        const channel = interaction.options.getChannel('channel');
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
        interaction.editReply(`Locked ${channel.name}`);
    },

    unlock: async (interaction) => {
        if (!interaction.member.permissions.has('ManageChannels')) return interaction.reply('You do not have permission');
        await interaction.deferReply({ ephemeral: true });
        const channel = interaction.options.getChannel('channel');
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: true });
        interaction.editReply(`Unlocked ${channel.name}`);
    },

    logs: async (interaction) => {
        if (!interaction.member.permissions.has('Administrator')) return interaction.reply('You do not have permission');
        interaction.reply('Config placeholder');
    },

    track: async (interaction) => interaction.reply('Config placeholder'),

    activity: async (interaction) => interaction.reply('Config placeholder'),

    logevents: async (interaction) => interaction.reply('Config placeholder'),

    logactions: async (interaction) => interaction.reply('Config placeholder'),

    rankup: async (interaction) => interaction.reply('Config placeholder'),

    rankdown: async (interaction) => interaction.reply('Config placeholder'),

    setrank: async (interaction) => interaction.reply('Config placeholder'),

    temprole: async (interaction) => {
        if (!interaction.member.permissions.has('ManageRoles')) return interaction.reply('You do not have permission');
        await interaction.deferReply({ ephemeral: true });
        const role = interaction.options.getRole('role');
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getString('duration');
        const member = interaction.guild.members.cache.get(user.id);
        if (!member) return interaction.editReply('User not found');
        await member.roles.add(role).catch(() => {});
        setTimeout(() => member.roles.remove(role).catch(() => {}), parseDuration(duration));
        interaction.editReply(`Gave ${role.name} to ${user.username} for ${duration}`);
    },

    schedule: async (interaction) => interaction.reply('Config placeholder'),

    announce: async (interaction) => interaction.reply('Config placeholder')
};

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
