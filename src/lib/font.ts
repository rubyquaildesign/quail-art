import { z } from 'zod';

const schema = z
	.object({
		props: z.object({
			'name': z.string(),
			'family': z.string(),
			'foundry': z.string(),
			'copyright': z.string(),
			'revision': z.string(),
			'point_size': z.number(),
			'weight': z.string(),
			'dpi': z.array(z.number()),
			'average_width': z.number(),
			'x_height': z.number(),
			'cap_height': z.number(),
			'ascent': z.number(),
			'descent': z.number(),
			'encoding': z.string(),
			'default_char': z.string(),
			'converter': z.string(),
			'source_name': z.string(),
			'source_path': z.string(),
			'source_format': z.string(),
			'xlfd.weight': z.string(),
			'xlfd.quad_width': z.string(),
			'scalable_width': z.string(),
		}),
		glyphs: z.array(
			z.object({
				pixels: z.array(z.array(z.number())),
				labels: z.array(z.string()),
				props: z.object({ shift_up: z.number() }),
			}),
		),
	})
	.strict();
