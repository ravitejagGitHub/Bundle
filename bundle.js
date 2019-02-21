const fs = require("fs");
const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const path = require("path");
const babel = require("babel-core");

/**
 * 1) Parse a single file and extract it's dependencis. 
 * 2) Recurslvely build dependency graph.
 * 3) Package everything in to one file.
 */

//* 1) Parse a single file and extract it's dependencis.
// Transform code using babel to make code compatabile to all browsers. 
let ID = 0;
function createAsset(filename) {
    const content = fs.readFileSync(filename, 'utf-8');
    const ast = babylon.parse(content, {
        sourceType: 'module'
    })
    const dependencis = [];

    traverse(ast, {
        ImportDeclaration: ({ node }) => {
            dependencis.push(node.source.value);
        }
    })
    const id = ID++;
    //transform code
    const { code } = babel.transformFromAst(ast, null, {
        presets: ['env']
    })
    return {
        id,
        filename,
        dependencis,
        code
    }
}

// * 2) Recurslvely build dependency graph.
function createGraph(entry) {
    const mainAsset = createAsset(entry);
    const queue = [mainAsset];

    for (const asset of queue) {
        const dirname = path.dirname(asset.filename);

        asset.mapping = {}
        asset.dependencis.forEach((relativePath) => {
            const absoultePath = path.join(dirname, relativePath);

            const child = createAsset(absoultePath);

            asset.mapping[relativePath] = child.id;
            queue.push(child);
        });
    }

    return queue;
}

function bundle(graph) {
    let modules = '';

    graph.forEach((module) => {
        modules += `
            ${module.id} : [
                function(require, module, exports) {
                    ${module.code}
                },
                ${JSON.stringify(module.mapping)}
            ],
        `
    });
    const result = `
    (function(modules){
        function require(id) {
            const [fn, mapping] = modules[id];

            function localRequire(relativePath) {
                return require(mapping[relativePath]);
            }
            const module = { exports: {} };

            fn(localRequire, module, module.exports)

            return module.exports;
        }

        require(0);
    })({${modules}})
    `

    return result;
}
const graph = createGraph("./entry.mjs");
const bundle_output = bundle(graph);
console.log(bundle_output);

//Generate bundle out file.
const bundle_file = "bundle_output.js";
fs.writeFile(path.join(__dirname, bundle_file), bundle_output, (err) => {
    if (err) throw err;
    console.log(`bundle file generate ${path.join(__dirname, bundle_file)}`);
});

