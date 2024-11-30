

const { SlashCommandBuilder } = require('discord.js');
const { OPENAI_KEY } = require('../../config.json');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: OPENAI_KEY
});



module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Start your adventure!')
    .addUserOption(option => option.setName("player1").setDescription("Player 1(Required)").setRequired(true))
    .addUserOption(option => option.setName("player2").setDescription("Player 2"))
    .addUserOption(option => option.setName("player3").setDescription("Player 3"))
    .addUserOption(option => option.setName("player4").setDescription("Player 4")),
	async execute(interaction) {
    const player1 = interaction.options.getUser('player1');
    const player2 = interaction.options.getUser('player2');
    const player3 = interaction.options.getUser('player3');
    const player4 = interaction.options.getUser('player4');

        let AIPrompt = [
            { role: 'system', content: 'You are the narrator of an interactive fantasy adventure starring characters with these names: ' + player1.username},
          ];

          if(player2){
            AIPrompt[0].content += ", " + player2.username
          }
          if(player3){
            AIPrompt[0].content += ", " + player3.username
          }
          if(player4){
            AIPrompt[0].content += ", " + player4.username
          }

        try {        
            const result = await openai
            .chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: AIPrompt,
                max_tokens: 300, // limit token usage
              })
              .catch((error) => {
                console.log(`OPENAI ERR: ${error}`);
              });
              console.log(result.choices[0].message.content);
              await interaction.reply('Beginning: ' + result.choices[0].message.content);
          } catch (error) {
            console.log(`ERR: ${error}`);
          }
	},
};