import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
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
        super(client, "edittag", {
            description: "Edit a tag of the guild.",
            aliases: [],
            category: "Config",
            memberPermission: ["Administrator"],
            usage: `.edittag`,
            cooldown: 10
        })
    }

    async execute(message: Message, args: any[]) {

      try {
        const tags = this.client.configs.get(`${message.guild?.id}`)?.customCommands;
        const tagName = args[0];
        if(!tagName) return message.channel["error"](`${message.author}, You should enter a tag name to edit.`);
        const foundTag = tags?.find((cmd) => cmd.name.toLowerCase() === tagName.toLowerCase());
        if(!foundTag) return message.channel["error"](`${message.author}, There is no tag in this server with name \`${tagName}\` to edit.`)

        const modal = new ModalBuilder()
            .setCustomId(`tag_edit_${message.author.id}`)
            .setTitle("Edit a tag")
            .addComponents(
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setLabel('Name')
                            .setCustomId("tag_edit_name")
                            .setPlaceholder('Enter the name of the tag you want to edit...')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                            .setMaxLength(10)
                            .setMinLength(3)
                            .setValue(foundTag.name)
                    ),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setLabel('Description')
                            .setCustomId('tag_edit_description')
                            .setPlaceholder('Enter a new description for the tag you want to edit...')
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(false)
                            .setMaxLength(1000)
                    ),
                new ActionRowBuilder<TextInputBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setLabel('Content')
                            .setCustomId('tag_edit_content')
                            .setPlaceholder('Enter a new response for the tag you want to edit...')
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
                    .setLabel("Edit the tag")
                    .setStyle(ButtonStyle.Primary)
            )

        const confirmMessage = await message.reply({ embeds: [{ description: `Please click on the button below to edit the tag \`${foundTag.name}\`.`, color: Colors.Blue }], components: [button] })

        const collector = confirmMessage.createMessageComponentCollector({ time: 60 * 1000, componentType: ComponentType.Button, max: 1 })

        collector.on("collect", async (interaction) => {
            if(interaction.user.id !== message.author.id) interaction.reply({ content: "You can't do this!", ephemeral: true });

            if(interaction.customId === "tag_showModal_button") await interaction.showModal(modal);
        })

        collector.on("end", (_, reason) => {
            if(reason === "time") {
                confirmMessage.edit({ embeds: [{ description: "Time out. Please run the command again if you still want to edit a tag!", color: Colors.Red }], components: [] });
            }

            confirmMessage.edit({ embeds: [{ description: "The tag is being edited or has already been edited.", color: Colors.Yellow }], components: [] });
        })

      } catch(e) {
          return message.reply({ content: `An error occured:\n\`\`\`js\n${e}\n\`\`\`` })
     }

    }
}