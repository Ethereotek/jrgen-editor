module.exports = function(RED){
	"use strict";
	function Jrgen(config){
		RED.nodes.createNode(this, config);
		var node = this;

		const utils = require('./utils.js');
		const blueprints = {
			'docs-html':'./blueprints/docs/html/docs-html.jrgen.blueprint.js',
			'docs-md':'./blueprints/docs/md/docs-md.jrgen.blueprint.js',
			'client-web-js':'./blueprints/client/web/js/client-web-js.jrgen.blueprint.js',
			'client-web-ts':'./blueprints/client/web/ts/client-web-ts.jrgen.blueprint.js',
			'server-nodejs':'./blueprints/server/nodejs/js/server-nodejs-js.jrgen.blueprint.js',
			'spec-postman':'./blueprints/spec/postman/spec-postman.jrgen.blueprint.js'
		}
		
		async function generateArtifact(targetArtifact, schema){

			const blueprint = await require(blueprints[targetArtifact])(schema);
			const artifact = utils.buildArtifacts(blueprint);
			return artifact;

			
		}
		node.on('input', async function(msg){
			let schema = msg.schema;
			let targetArtifact = msg.targetArtifact;

			if(!schema || !targetArtifact){
				node.error('No schema or targetArtifact', msg)
				return
			}
			if(typeof(schema) != 'object' || typeof(targetArtifact) != 'string'){
				node.error('Schema or targetArtifact is wrong type. Schema must be object, targetArtifact must be string', msg)
				return;
			}
			let artifact = await generateArtifact(targetArtifact, schema);
			msg.payload = {
				targetArtifact,
				resolvedArtifact:artifact
			};
			node.send(msg)
			
		});

	}
	RED.nodes.registerType('jrgen', Jrgen);
};