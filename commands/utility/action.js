const { SlashCommandBuilder,} = require("discord.js");
const { OPENAI_KEY } = require('../../config.json');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: OPENAI_KEY
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('action')
		.setDescription('What\'s your next move!')
		.addStringOption(option => option.setName("move").setDescription("type your character's next action")),
	async execute(interaction) {

		let conversationLog = [
			{ role: 'system', content: 'You are the narrator of an interactive fantasy adventure.' },
		  ];

		let channel = await interaction.client.channels.fetch(interaction.channelId);
		let prevMessages = await channel.messages.fetch({ limit: 5 });

		prevMessages.reverse();
		
		prevMessages.forEach((msg) => {
			if (msg.author.username == 'AdvAI' && (msg.content.startsWith('Beginning:') || msg.content.startsWith('Result:'))) {
			  conversationLog.push({
				role: 'assistant',
				content: msg.content,
			  });
			}
	  
			if (msg.author.username == 'AdvAI' && msg.content.startsWith('Action')) {
			  conversationLog.push({
				role: 'user',
				content: msg.content,
			  });
			}
		  });

		  conversationLog.push({
			role: 'user',
			content: 'Action(' + interaction.user.username + '): ' + interaction.options.getString('move'),
		  });

		try {        
            const result = await openai
            .chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: conversationLog,
                max_tokens: 100, // limit token usage
              })
              .catch((error) => {
                console.log(`OPENAI ERR: ${error}`);
              });
			  await interaction.deferReply();
			  await interaction.followUp('Action(' + interaction.user.username + '): ' + interaction.options.getString('move'));
              await interaction.followUp('Result: ' + result.choices[0].message.content);
          } catch (error) {
            console.log(`ERR: ${error}`);
          }
		
	},
};