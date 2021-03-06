export const federationSpec = `
scalar _Any
scalar _FieldSet

union _Entity

type _Service {
    sdl: String
}

extend type Query {
    _entities(representations: [_Any!]!): [_Entity]!
    _service: _Service!
}

directive @external on FIELD_DEFINITION
directive @requires(fields: _FieldSet!) on FIELD_DEFINITION
directive @provides(fields: _FieldSet!) on FIELD_DEFINITION
directive @key(fields: _FieldSet!) repeatable on OBJECT | INTERFACE
directive @extends on OBJECT | INTERFACE
`;