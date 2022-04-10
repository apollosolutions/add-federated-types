# add-federated-types
A simple CLI which can add Apollo Federation types to a schema and merge extensions

**The code in this repository is experimental and has been provided for reference purposes only. Community feedback is welcome but this project may not be supported in the same way that repositories in the official [Apollo GraphQL GitHub organization](https://github.com/apollographql) are. If you need help you can file an issue on this repository, [contact Apollo](https://www.apollographql.com/contact-sales) to talk to an expert, or create a ticket directly in Apollo Studio.**
_______________

## Usage
You can run the script with npx, which will output the resulting schema to stdout.

```shell
npx github:@apollosolutions/add-federated-types \
  --schema schema.graphql \
  --extensions extensions.graphql
```

Optionally you can include the `--out` flag to specify a file name to print to

```shell
npx github:@apollosolutions/add-federated-types \
  --schema schema.graphql \
  --extensions extensions.graphql \
  --out new-schema.graphql
```

## Context
[Apollo Federation](https://www.apollographql.com/docs/federation) relies on the fact the all the subgraphs that connect
to the gateway have some certain directives in the schema, so it can understand in a declarative approach what parts of
the schema it can use to extend with other subgraph types. If you have a GraphQL API with a schema that you do not control,
like another SaaS product or some external team, and you can not have them add the directives to the schema, as long as the schema
is annotated with the correct directives, you can still get some benefits of a federated graph.

Mainly with use of the `@key` directive you can mark types and their IDs to that other services in your graph can extend those types.
Take for example the [Rick and Morty API](https://rickandmortyapi.com/graphql). This API has the concept of a `Character`:

```graphql
type Character {
    id: ID
    name: String
    status: String
    # ...other fields
}
```

This API does not have the federation directives defined, but if you marked the `Character` type with the `@key` directive,
then you can have other subgraphs extend this type. So our desired state is this:

```graphql
type Character @key(fields: "id") {
    id: ID
    name: String
    status: String
    # ...other fields
}
```

This small CLI accomplishes this with the [@graphql-tools/merge](https://www.graphql-tools.com/docs/schema-merging) library.
You specific the end result or additions you want to make with types, then it takes the original schema, the [Federation spec](https://www.apollographql.com/docs/federation/federation-spec) types,
and your extensions to produce a new federation compatible schema. You can then take this schema and publish it to [Apollo Studio](https://studio.apollographql.com/) and get a federated supergraph.

## Example
You can find a runnable example here: https://github.com/apollosolutions/demo-federated-rickandmorty


1. Fetch the existing Rick and Morty schema (without Federation)
```shell
rover graph introspect https://rickandmortyapi.com/graphql > real-schema.graphql 
```

2. Specify your schema extensions

```graphql
# extensions.graphql

type Character @key(fields: "id")
```

3. Run `@apollosolutions/add-federated-types` to get a new schema

```shell
npx github:@apollosolutions/add-federated-types \
  --schema real-schema.graphql \
  --extensions extensions.graphql \
  --out new-schema.graphql
```

## Known Issues

This script can not modify the resolvers or add more runtime code to the existing API.
That means that anything that relies on having the [Federation `_entities` field](https://www.apollographql.com/docs/federation/federation-spec#query_entities) in the API you do not control is not currently supported.
In the example above this means in other schemas you do control, you can extend the `Character` type to add new fields, but you can have the `Character` type be added as a field on other types because the Gateway will not be able to make a call back to the API to resolve based on the `Character.id`.

Also, to have an effective federated graph, you will want to run a schema publish whenever there is a schema update on the API you do not control, so ideally there would be some CI/CD process that can be notified to run on schema changes so you can re-run this script with the new updates.