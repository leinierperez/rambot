const { Events } = require('../validation/event-names');
const fs = require('fs');
const Ascii = require('ascii-table');

module.exports = async (client, currencySystem) => {
  const Table = new Ascii('Events Loaded');

  const eventFiles = fs
    .readdirSync('./events')
    .filter((f) => f.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(`../events/${file}`);

    if (!Events.includes(event.name) || !event.name) {
      Table.addRow(
        `${event.name || 'MISSING'}`,
        `🔴 Event name is either invalid or missing: ${file}`
      );
      break;
    }

    if (event.once) {
      client.once(event.name, (...args) =>
        event.execute(client, currencySystem, ...args)
      );
    } else {
      client.on(event.name, (...args) =>
        event.execute(...args, client, currencySystem)
      );
    }

    Table.addRow(event.name, '🟢SUCCESSFUL');
  }

  console.log(Table.toString());
};
