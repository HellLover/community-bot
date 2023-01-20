import { Event } from "../../structures/Events";
import { Client } from "../../structures/Client";
import { 
    ActionRowBuilder, 
    ComponentType, 
    EmbedBuilder, 
    Interaction, 
    StringSelectMenuBuilder
 } from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "interactionCreate");
    }

    async execute(interaction: Interaction<"cached">) {
        if(interaction.isModalSubmit()) {
            const guildData = this.client.configs.get(interaction.guild.id);

            if(interaction.customId === `tag_create_${interaction.user.id}`) {
                const nameInput = interaction.fields.getTextInputValue("tag_create_name");
                const nameBusy = guildData?.customCommands?.find((cmd) => cmd.name === nameInput)

                if(nameBusy || this.client.commands.has(nameInput)) {
                    return interaction.reply({ content: `There is already a tag or a command with name \`${nameInput}\`.`, ephemeral: true })
                }

                let component = [
                    new StringSelectMenuBuilder()
                        .setCustomId('select_visibility_' + interaction.id + '_' + interaction.user.id)
                        .setPlaceholder('Select visibility')
                        .setOptions(
                            {
                                label: 'Public',
                                description: 'Allows everyone to see your tag.',
                                value: 'public'
                            },
                            {
                                label: 'Private',
                                description: 'No one can see this tag except for you.',
                                value: 'private'
                            }
                        )
                ]

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Tag visibility')
                            .setDescription('Choose a tag visibility type in the select menu below.')
                            .setColor("Grey")
                    ],
                    components: [
                        new ActionRowBuilder<StringSelectMenuBuilder>()
                            .addComponents(
                                component[0]
                            )
                    ],
                    ephemeral: true
                });

                const collector = interaction.channel?.createMessageComponentCollector({
                    componentType: ComponentType.StringSelect
                });

                collector?.on('collect', async (i) => {
                    if (i.customId !== `select_visibility_${interaction.id}_${interaction.user.id}`) return;

                    await i.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`Creating the tag...`)
                                .setColor("Grey")
                        ],
                        ephemeral: true
                    });

                    await interaction.editReply({
                        components: [
                            new ActionRowBuilder<StringSelectMenuBuilder>()
                                .addComponents(
                                    component[0].setDisabled(true).setPlaceholder('Selected: ' + i.values[0])
                                )
                        ]
                    }).catch(() => { });

                    let data = {
                        guildId: interaction.guild.id,
                        author: interaction.user.id,
                        name: interaction.fields.getTextInputValue('tag_create_name'),
                        description: interaction.fields.getTextInputValue('tag_create_description') || null,
                        response: interaction.fields.getTextInputValue('tag_create_content'),
                        createdAt: new Date(),
                        visibility: i.values[0]
                    };

                    await i.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`Saving the changes...`)
                                .setColor("Grey")
                        ]
                    }).catch(() => { });

                    await this.client.database.updateGuild(interaction.guild.id, {
                        customCommands: guildData?.customCommands ? [...guildData.customCommands, data] : [data]
                    })

                    i.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`Successfully created the tag \`${interaction.fields.getTextInputValue('tag_create_name')}\`!`)
                                .setColor('Yellow')
                        ]
                    })
                });
            } else if(interaction.customId === `tag_edit_${interaction.user.id}`) {
                const availableTags = guildData?.customCommands;
                const input = interaction.fields.getTextInputValue("tag_edit_name");
                const foundTag = availableTags?.find((tag) => tag.name.toLowerCase() === input.toLowerCase());

                if (!foundTag) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setDescription(`Couldn't find the tag \`${input}\`..`)
                                .setColor("Red")
                        ],
                        ephemeral: true
                    });
                }

                if (foundTag.author !== interaction.user.id) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("You can't edit this tag as you're not the owner of it.")
                    ],
                    ephemeral: true
                });

                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`Updating the tag...`)
                            .setColor("Grey")
                    ],
                    ephemeral: true
                });

                const data = {
                    guildId: interaction.guild.id,
                    author: interaction.user.id,
                    name: interaction.fields.getTextInputValue('tag_edit_name'),
                    description: interaction.fields.getTextInputValue('tag_edit_description') || foundTag.description,
                    response: interaction.fields.getTextInputValue('tag_edit_content'),
                    createdAt: foundTag.createdAt,
                    visibility: foundTag.visibility
                };

                await this.client.database.updateGuild(interaction.guild.id, {
                    customCommands: [...<[]>guildData?.customCommands?.filter((cmd) => cmd.name !== data.name), data]
                })

                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`Successfully updated the tag \`${interaction.fields.getTextInputValue('tag_edit_name')}\`!`)
                            .setColor('Yellow')
                    ]
                });
            };
        }
    }
}