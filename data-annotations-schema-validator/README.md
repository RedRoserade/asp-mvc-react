# DataAnnotation validator

This package contains a set of helper functions that validate a data model against a schema generated using .NET's `System.ComponentModel.DataAnnotations`.

## Usage

### Installing:

`npm install --save data-annotations-schema-validator`

### Use it:

```javascript
var schemaValidator = require('data-annotations-schema-validator');
```

## Functions

### `validate(model: object, schema: object) => object`

Validates `model` against `schema`, and returns the result as an object.

The generated object contains, for each property, the type errors `typeErrors` (for example, when a field has a string and should have a number) and the content errors `contentErrors` (value range, required, etc).

The returned object also contains a field, `valid`, which tells the validity of the tested `model`.

If the property is an object, a `propertyErrors` object is added, which follows the same structure. For arrays, an `itemErrors` array is added. For each item in the `model`'s array, an item in the resulting array is added, which follows the structure above.

Example output:
```
{
    valid: boolean,
    modelState: {
        <property>: {
            typeErrors: array,
            contentErrors: array,
            valid: boolean
        },
        (...)
    }
}
```

### `validateAsync(model: object, schemaName: string, cb: function (err, result)) => void`

Asynchronous version of `validate`. This version asynchronously loads the schema from the server and then validates `model`.

### `loadSchema(schemaName: string, cb: function (err, schema)) => void`

Asynchonously loads the schema with the specified name from the server, parses it to find more schemas (which are then loaded into cache), and then returns the schema in the callback, `cb`.
