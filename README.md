# jrgen-editor

jrgen-editor is a fork of jrgen that abandons the command-line and hosts your json-rpc spec on a node-red server with an embedded text editor for live-editing of the spec in either JSON or YAML. The schema can be saved to the server, so you don't have to worry about losing your work. The spec also allows you to send the example requests over UDP or TCP to an RPC server of your chosing, as defined in the schema. 

For more information on the schema format, check out the repo for the original jrgen doc generator: https://github.com/mzernetsch/jrgen.git


## Docker
The easiest way to run jrgen-editor is by building a Docker image. In the root directory, run `docker build -t jrgen-editor .` then run the container, for example: 
- `docker run -d jrgen-editor`

The uri for the editor is `/jrgen-editor`.

The container will run on port 1880 by default, use `-p` to map to a different port, for example: `docker run -d -p 9100:1880 jrgen-editor`. In this example, you would navigate to the editor by typing `http://localhost:9100/jrgen-editor`.

## Editing your schema
You can edit the schema in either json or yaml. To change the language, use the `Edit` drop down to select your preferred language. The schema will always save be saved to the server as JSON, however, you can download the either the JSON or YAML using the `File` drop down. 

The spec will update in real time, but you must explicitly save to the server using the `Save to Server` button. The icon will display green on success, red on an error.

## Getting data from the server
You can query the server for the underlying data.
- **`/jrgen-editor/schema.json`** will return the json schema; note that this doesn't resolve pointers or references. You can use the query parameter **`method`** to get specific method, which will resolve references within the method defintion, e.g.  
	- **`/jrgen-editor/schema.json?method=Session.Login`**

## Generating clients and servers 
jrgen-editor is capable of generating the same files as the original jrgen package. It does this by simply executing the functions provided by jrgen on the server and then making the return available for download. These are all accessible via the `Generate...` drop downs. 