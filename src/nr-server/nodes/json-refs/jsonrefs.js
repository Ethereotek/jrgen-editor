module.exports = function(RED) {
    "use strict";
    function ResolveJsonRefs(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var JsonRefs = require('json-refs');
        async function resolve(schema){
            let resolvedSchema = await JsonRefs.resolveRefs(schema)
                .then(function(res){
                    return res.resolved
                })
            // msg.payload = resolvedSchema
            // node.send(resolvedSchema);
            // node.warn("inside resolve function")
            // node.warn(resolvedSchema)
            return resolvedSchema
        }
        node.on('input', async function(msg) {
            let schema = msg.payload;
			let resolvedSchema = await resolve(schema);
            msg.payload = resolvedSchema;
            // node.warn("inside node.on cb")
            // node.warn(msg);
            node.send(msg)

        });



    }
    RED.nodes.registerType("json-refs-parser", ResolveJsonRefs);
};