import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { createCanvas } from "canvas";
import { COLORS } from "../../constants/colors.js";

const constants = {
    GRID_LINES: 15,
    GRID_THICKNESS: 5,
    GRID_COLOR: COLORS.white,

    CANVAS_WIDTH: 1000,
    CANVAS_HEIGHT: 1000,
    CANVAS_MARGINS: 50,
    CANVAS_COLOR: COLORS.vlgrey,

    SKILLBAR_COLOR: COLORS.black,
    SKILLBAR_GAP: 20,
}

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

const makeGrid = (context, w, h, {lines, color, thickness}) => {
    const gridWidth = w/lines
    const gridHeight = h/lines

    // vertical
    for (let i = 0; i < lines; i++) {
        if (i === 0) continue
        context.fillStyle = color
        context.fillRect(gridWidth * i, 0, thickness, h)
    }  
    
    // horizontal
    for (let i = 0; i < lines; i++) {
        if (i === 0) continue
        context.fillStyle = color
        context.fillRect(0, gridHeight * i, w, thickness)
    }   
}

const makeSkillBar = (context, x, y, w, h, {color}) => {
    context.fillStyle = color

    context.beginPath()
    context.roundRect(x, y, w, h, [h/2])
    context.fill()
}

const commandData = new SlashCommandBuilder()
                    .setName('stat')
                    .setDescription('lorem ipsum dolor sit amet.')
                    .addIntegerOption(option => 
                        option
                        .setName('n_skillbars')
                        .setDescription('how many skill bars (dev)')
                        .setRequired(true)
                    )

const executeFunction = async (interaction) => {
    const canvas = createCanvas(constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
	const context = canvas.getContext('2d');
    context.fillStyle = constants.CANVAS_COLOR
    context.fillRect(0, 0, canvas.width, canvas.height)

    const arg1 = interaction.options.get('n_skillbars').value

    makeGrid(context, 1000, 1000, {lines: constants.GRID_LINES, color: constants.GRID_COLOR, thickness: constants.GRID_THICKNESS})

    for (let i = 0; i < arg1; i++) {
        const SKILLBAR_WIDTH = (constants.CANVAS_WIDTH - (constants.CANVAS_MARGINS*2))
        const SKILLBAR_HEIGHT = (constants.CANVAS_HEIGHT / arg1) / 1.08 

        const Y = 20 + ((i*SKILLBAR_HEIGHT) + (i*constants.SKILLBAR_GAP))

        makeSkillBar(context, constants.CANVAS_MARGINS, Y, SKILLBAR_WIDTH, SKILLBAR_HEIGHT, {color: constants.SKILLBAR_COLOR})
    }

    const attachment = new AttachmentBuilder(canvas.toBuffer('image/png', { compressionLevel: 1, filters: canvas.PNG_FILTER_NONE }), { name: 'stats.png' });
    await interaction.reply({ files: [attachment] })
}

export const command = {
    commandData: commandData,
    executeFunction: executeFunction
}