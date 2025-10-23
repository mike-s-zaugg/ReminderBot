import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

import {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel]
});

// ✅ Slash Command registrieren
const commands = [
  new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Erstellt eine Erinnerung")
    // 🟡 Required zuerst!
    .addStringOption(option =>
      option.setName("nachricht").setDescription("Deine Nachricht").setRequired(true)
    )
    // ⚪ Optional danach
    .addIntegerOption(option =>
      option.setName("days").setDescription("Tage").setRequired(false)
    )
    .addIntegerOption(option =>
      option.setName("hours").setDescription("Stunden").setRequired(false)
    )
    .addIntegerOption(option =>
      option.setName("minutes").setDescription("Minuten").setRequired(false)
    )
    .addIntegerOption(option =>
      option.setName("seconds").setDescription("Sekunden").setRequired(false)
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
    const msg = interaction.options.getString("nachricht");
    const days = interaction.options.getInteger("days") || 0;
    const hours = interaction.options.getInteger("hours") || 0;
    const minutes = interaction.options.getInteger("minutes") || 0;
    const seconds = interaction.options.getInteger("seconds") || 0;

    const timeMs =
      days * 24 * 60 * 60 * 1000 +
      hours * 60 * 60 * 1000 +
      minutes * 60 * 1000 +
      seconds * 1000;

    if (timeMs === 0) {
      return interaction.reply("⚠️ Bitte eine gültige Zeit angeben.");
    }

    await interaction.reply(
      `⏳ Ich erinnere dich in ${days}d ${hours}h ${minutes}m ${seconds}s: **${msg}**`
    );

    setTimeout(() => {
      interaction.followUp(`⏰ **Erinnerung:** ${msg}`);
    }, timeMs);
  }
});

client.login(TOKEN);
