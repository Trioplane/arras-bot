import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import Canvas from '@napi-rs/canvas'

const commandData = new SlashCommandBuilder()
                    .setName('stat')
                    .setDescription('lorem ipsum dolor sit amet.')

const executeFunction = async (interaction) => {
    const canvas = Canvas.createCanvas(1000, 1000);
	const context = canvas.getContext('2d');

    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.font = '100px sans-serif';
	context.fillStyle = 'white';
	context.fillText('test', canvas.width / 2, canvas.height / 2);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'stats.png' });
    await interaction.reply({ files: [attachment] })
}

export const command = {
    commandData: commandData,
    executeFunction: executeFunction
}