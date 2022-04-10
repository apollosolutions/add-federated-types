import { Command, Option } from 'clipanion';
import { readFileSync, writeFileSync } from 'fs';
import { printSchemaWithDirectives } from '@graphql-tools/utils';
import { buildASTSchema } from 'graphql';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { federationSpec } from './federation-spec.js'

export class DefaultCommand extends Command {
    schema = Option.String("--schema", { required: true });

    extensions = Option.String("--extensions", { required: true });

    output = Option.String("--out", { required: false });

    async execute() {
        const schemaWithoutFederation = readFileSync(this.schema, 'utf-8');
        const extensionsDefs = readFileSync(this.extensions, 'utf-8');

        const merged = buildASTSchema(mergeTypeDefs([schemaWithoutFederation, federationSpec, extensionsDefs]));
        const sdl = printSchemaWithDirectives(merged);

        if (this.output) {
            writeFileSync(this.output, sdl);
        } else {
            this.context.stdout.write(sdl)
        }
    }
}