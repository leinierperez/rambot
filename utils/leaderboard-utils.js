const userModel = require('../models/user');
const { paginator } = require('../utils/paginator');
const Ascii = require('ascii-table');

module.exports = {
  async getWordleLeaderboard(interaction, client) {
    const pages = [];
    let pageMsg = '';
    const usersData = await userModel.find().sort('-wordleStats.score');
    let playersPerPage = 10;
    for (let index = 0; index < usersData.length; index += 10) {
      const currentPlayer = usersData.slice(index, playersPerPage);
      playersPerPage += 10;
      let rankNumber = index;
      const Table = new Ascii('Wordle Leaderboard');
      Table.setHeading(
        'Rank',
        'Score',
        'Username',
        'W/L',
        'Avg Guesses',
        'Invalid words'
      );
      for (const { discordId, wordleStats } of currentPlayer) {
        const {
          score,
          totalGames,
          totalGuesses,
          totalWins,
          totalLosses,
          totalInvalidWords,
        } = wordleStats;
        const userName = (
          await client.users.fetch(discordId, [{ cache: true }])
        ).username;
        Table.addRow(
          `${++rankNumber}`,
          `${score}`,
          `${userName}`,
          `${totalWins}/${totalLosses} (${Math.round(
            (totalWins / totalGames) * 100
          )}%)`,
          `${(totalGuesses / totalGames).toFixed(2)}`,
          `${totalInvalidWords}`
        );
      }
      for (let column = 0; column < 6; column++) {
        Table.setAlign(column, Table.__nameAlign);
      }
      Table.removeBorder();
      Table.setBorder('|', '_', '.', '|');
      pageMsg = Table.toString();
      pages.push(pageMsg);
    }

    paginator(interaction, pages);
  },
  async getTriviaLeaderboard(interaction, client) {
    const pages = [];
    let pageMsg = '';
    const usersData = (
      await userModel.find().sort('-triviaStats.score')
    ).filter((user) => user.triviaStats.score > 0);
    let usersPerPage = 10;
    for (let index = 0; index < usersData.length; index += 10) {
      const currentUser = usersData.slice(index, usersPerPage);
      usersPerPage += 10;
      let rankNumber = index;
      const Table = new Ascii('Trivia Leaderboard');
      Table.setHeading('Rank', 'Score', 'Username', 'Correct Answers');
      for (const { discordId, triviaStats } of currentUser) {
        const { score, totalCorrectAnswers } = triviaStats;
        const userName = (
          await client.users.fetch(discordId, [{ cache: true }])
        ).username;
        Table.addRow(
          `${++rankNumber}`,
          `${score}`,
          `${userName}`,
          `${totalCorrectAnswers}`
        );
      }
      for (let column = 0; column < 6; column++) {
        Table.setAlign(column, Table.__nameAlign);
      }
      Table.removeBorder();
      Table.setBorder('|', '_', '.', '|');
      pageMsg = Table.toString();
      pages.push(pageMsg);
    }

    paginator(interaction, pages);
  },
};
