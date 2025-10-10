import { printSchemaWithDirectives } from '@graphql-tools/utils';
import { buildASTSchema } from 'graphql';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { federationSpec } from './federation-spec.js';

/**
 * Adds Apollo Federation types and directives to a base GraphQL schema.
 *
 * @param {string} schema - The base SDL schema string.
 * @param {string} extensions - Additional schema extensions SDL.
 * @returns {string} The merged SDL string with federation spec included.
 *
 * This function merges the base schema, Federation v2 spec, and any additional extensions,
 * then prints and returns the final SDL. Useful for preparing schemas that need federation support.
 */
export function addFederatedTypes(schema, extensions) {
    const merged = buildASTSchema(mergeTypeDefs([schema, federationSpec, extensions]));
    return printSchemaWithDirectives(merged);
}