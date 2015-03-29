'use strict';

import { validate, validateAsync, loadSchema, flattenModelState } from 'validator';

let $ = function (query, context = document) { return context.querySelector(query); };

var obj = {
    Name: 'André',
    Email: 'a@a.a',
    Age: 21,
    Pets: [
        {
            Name: 'Bobi'
        }
    ]
};

let objectBox = $('#object'),
    resultBox = $('#results');

objectBox.value = JSON.stringify(obj, null, '  ');

function doValidation() {
    try {
        obj = JSON.parse(objectBox.value);
        resultBox.innerText = "Loading...";

        loadSchema('Person', (err, schema) => {
            if (err) { throw err; }

            resultBox.innerText = JSON.stringify(validate(obj, schema), null, '  ');

        });

    } catch (e) {
        resultBox.innerText = e.toString();
    }

}

$('#run').addEventListener('click', doValidation);
