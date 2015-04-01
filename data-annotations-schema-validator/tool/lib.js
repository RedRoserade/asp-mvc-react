/**
 * Helper that builds the npm package.
 */
'use strict';

import path from 'path';
import { exec } from 'child-process-promise';

const root = path.resolve(__dirname, '../');
const libDir = path.join(root, 'lib');
const srcDir = path.join(root, 'src');

export default function buildNpm() {
    console.log('Building npm module');

    return exec(`rm -rf ${libDir}`)
        .then(() => exec(`babel ${srcDir} --out-dir ${libDir}`))
        .then(() => console.log('Npm module built successfully.'));
}
