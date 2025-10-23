import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

import { Client, GatewayIntentBits, Partials, REST, Routes, SlashCommandBuilder } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel]
});

// ✅ Reminder Command registrieren
const commands = [
  new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Erstellt eine Erinnerung")
    .addStringOption(option =>
      option.setName("zeit").setDescription("z.B. 10s, 5m, 1h").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("nachricht").setDescription("Deine Nachricht").setRequired(true)
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log("✅ Slash Commands registriert!");
  } catch (err) {
    console.error(err);
  }
})();

// 🕒 Reminder Logik
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "remind") {
    const zeit = interaction.options.getString("zeit");
    const msg = interaction.options.getString("nachricht");

    const match = zeit.match(/(\d+)(s|m|h)/);
    if (!match) return interaction.reply("⚠️ Ungültiges Zeitformat. (z.B. 10s, 5m, 1h)");

    let timeMs = parseInt(match[1]) * (match[2] === "s" ? 1000 : match[2] === "m" ? 60000 : 3600000);
    await interaction.reply(`⏳ Ich erinnere dich in ${zeit}: **${msg}**`);

    setTimeout(() => {
      interaction.followUp(`⏰ **Erinnerung:** ${msg}`);
    }, timeMs);
  }
});

client.login(TOKEN);
