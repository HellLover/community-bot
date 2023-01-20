import Command from "../../structures/Commands";
import { Client } from "../../structures/Client";
import { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    Colors, 
    ComponentType, 
    Message, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle 
} from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "addtag", {
            description: "Add a tag to the guild.",
            aliases: [],
            category: "Config",
            memberPermission: ["Administrator"],
            usage: ".addtag",
            cooldown: 10
        })
    }

    async execute(message: Message, args: any[]) {

      try {

        const modal = new ModalBuilder()
            .setCustomId(`tag_create_${message.author.id}`)
            .setTitle("Create a new tag")
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setLabel('Name')
                            .setCustomId("tag_create_name")
                            .setPlaceholder('Enter a name for the tag...')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                            .setMaxLength(10)
                            .setMinLength(3)
                    ),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setLabel('Description')
                            .setCustomId('tag_create_description')
                            .setPlaceholder('Enter a description for the tag...')
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(false)
                            .setMaxLength(1000)
                    ),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setLabel('Content')
                            .setCustomId('tag_create_content')
                            .setPlaceholder('Enter a response for the tag...')
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                            .setMaxLength(3000)
                            .setMinLength(10)
                    ),
            )

        const button = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("tag_showModal_button")
                    .setLabel("Create a tag")
                    .setStyle(ButtonStyle.Primary)
            )

        const confirmMessage = await message.reply({ embeds: [{ description: "Please click on the button below to create a tag.", color: Colors.Blue }], components: [button] })

        const collector = confirmMessage.createMessageComponentCollector({ time: 60 * 1000, componentType: ComponentType.Button, max: 1 })

        collector.on("collect", async (interaction) => {
            if(interaction.user.id !== message.author.id) interaction.reply({ content: "You can't do this!", ephemeral: true });

            if(interaction.customId === "tag_showModal_button") await interaction.showModal(modal);
        })

        collector.on("end", (_, reason) => {
            if(reason === "time") {
                confirmMessage.edit({ embeds: [{ description: "Time out. Please run the command again if you still want to create a tag!", color: Colors.Red }], components: [] });
            }

            confirmMessage.edit({ embeds: [{ description: "The tag is being created or has already been created.", color: Colors.Yellow }], components: [] });
        })

      } catch(e) {
          return message.reply({ content: `An error occured:\n\`\`\`js\n${e}\n\`\`\`` })
     }

    }
}