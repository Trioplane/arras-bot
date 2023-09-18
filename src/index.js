import { AttachmentBuilder, Client, Collection, Events, GatewayIntentBits } from "discord.js";
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import 'dotenv/config'

const TOKEN = process.env.TOKEN

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
})

client.once(Events.ClientReady, bot => {
    console.log(`Logged in as ${bot.user.tag}`)
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.executeFunction(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.commands = new Collection();
const foldersPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'commands')
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const { command } = await import(`../commands/${folder}/${file}`);
        if ('commandData' in command && 'executeFunction' in command) {
            client.commands.set(command.commandData.name, command);
        } else {
            console.log(`[WARNING] The command at ${`../commands/${file}`} is missing a required "commandData" or "executeFunction" property.`);
        }
    }
}

client.login(TOKEN)

