import * as express from "express";
import { Client } from "../../handlers/ClientHandler";

const router = express.Router();

export const Commands = (client: Client) => {

    router.get('/', (req, res) => {
		const categories = client.commands
			.map(c => c.category)
			.filter((v, i, a) => a.indexOf(v) === i)
			.sort((a, b) => a - b)
			.map(category => ({
				name: category,
				commands: client.commands.filter(c => c.category === category)
					.sort((a, b) => a.name - b.name)
					.map(c => c.name),
			}));
		res.status(200).json({ categories });
	});

	router.get('/json', (req, res) => {
		res.status(200).json([ ...client.commands.map((cmd) => {
			return {
				name: cmd.name,
				descritpion: cmd.description,
				category: cmd.category,
				usage: cmd.usage
			}
		}) ]);
	});

	router.get('/:command', (req, res) => {
		if (client.commands.get(req.params.command) || client.commands.get(client.aliases.get(req.params.command))) {
			const command = client.commands.get(req.params.command) || client.commands.get(client.aliases.get(req.params.command));
			res.status(200).json({ 
				name: command.name,
				descritpion: command.description,
				category: command.category,
				usage: command.usage
			});
		} else {
			res.status(400).json({ error: 'Invalid command!' });
	    }
	});

	return router;
}