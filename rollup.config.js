import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'js/main.js',
    plugins: [nodeResolve()]
};

