import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { createCanvas } from "canvas";

const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return context.font;
};

const commandData = new SlashCommandBuilder()
                    .setName('stat')
                    .setDescription('lorem ipsum dolor sit amet.')

const executeFunction = async (interaction) => {
    const canvas = createCanvas(1000, 1000);
	const context = canvas.getContext('2d');

    context.fillStyle = 'lavender'
    context.fillRect(0, 0, canvas.width, canvas.height)

    const attachment = new AttachmentBuilder(canvas.toBuffer('image/png', { compressionLevel: 1, filters: canvas.PNG_FILTER_NONE }), { name: 'stats.png' });
    await interaction.reply({ files: [attachment] })
}

export const command = {
    commandData: commandData,
    executeFunction: executeFunction
}