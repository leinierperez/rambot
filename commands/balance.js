const {
  CommandInteraction,
  Client,
  MessageEmbed,
  MessageAttachment,
} = require('discord.js');
const CurrencySystem = require('currency-system');
const { rCoin } = require('../validation/EmojiCodes');

module.exports = {
  name: 'balance',
  description: "Display a user's balance",
  options: [
    {
      name: 'user',
      description: 'User to view balance of',
      type: 'USER',
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   * @param {CurrencySystem} currencySystem
   */
  async execute(interaction, client, currencySystem) {
    const user = interaction.options.getUser('user') || interaction.user;
    const result = await currencySystem.balance({
      user: user,
      guild: interaction.guild.id,
    });
    const bankingIcon = new MessageAttachment(
      './assets/slots/banking.png',
      'banking.png'
    );
    const balanceEmbed = new MessageEmbed()
      .setColor('RANDOM')
      .setAuthor({
        name: user.username,
        iconURL: `${user.displayAvatarURL()}`,
      })
      .setTitle('Balance')
      .setDescription(
        `Wallet: ${result.wallet.toLocaleString()} ${rCoin}\nBank: ${result.bank.toLocaleString()} ${rCoin}\nNetworth: ${result.networth.toLocaleString()} ${rCoin}`
      )
      .setThumbnail('attachment://banking.png')
      .setFooter({
        text: 'Remember to deposit your money to the bank to avoid being robbed',
      });
    await interaction.reply({ embeds: [balanceEmbed], files: [bankingIcon] });
  },
};
