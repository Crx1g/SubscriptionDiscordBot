const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const PREFIX = '!'; // Customize this to your liking
const SUBSCRIPTION_ROLE_ID = '989475662370840646'; // Replace with your role ID
const MS_PER_DAY = 86400000; // Number of milliseconds per day

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return; // Ignore messages from bots and non-commands
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'subscribe') {
    // Check if the user is an admin
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.reply('You do not have permission to use this command.');
    }

    // Check if a duration was provided
    const duration = args.pop();
    if (!duration || isNaN(duration)) {
      return message.reply('Please provide a valid subscription duration in days.');
    }

    // Convert duration to milliseconds
    const durationInMs = duration * MS_PER_DAY;

    // Get the subscription role
    const role = message.guild.roles.cache.get(SUBSCRIPTION_ROLE_ID);
    if (!role) {
      return message.reply('The subscription role does not exist.');
    }

    // Get the tagged user from the message
    const user = message.mentions.members.first();
    if (!user) {
      return message.reply('Please tag a valid user to subscribe.');
    }

    // Add the role to the user
    await user.roles.add(role);

    // Set a timeout to remove the role after the subscription duration has passed
    setTimeout(async () => {
      await user.roles.remove(role);
      message.channel.send(`The subscription for ${user} has ended. The ${role.name} role has been removed.`);
    }, durationInMs);

    message.reply(`You have subscribed ${user} for ${duration} day(s). The ${role.name} role has been added.`);
  }
});

client.login('yourtoken');
