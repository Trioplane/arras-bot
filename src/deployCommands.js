import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config'

const commands = [];

const foldersPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'commands')
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = join(foldersPath, folder)
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const { command } = await import(`../commands/${folder}/${file}`);
        if ('commandData' in command && 'executeFunction' in command) {
            commands.push(command.commandData.toJSON())
        } else {
            console.log(`[WARNING] The command at ${`../commands/${file}`} is missing a required "commandData" or "executeFunction" property.`);
        }
    }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();