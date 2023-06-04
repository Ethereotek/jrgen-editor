# jrgen-editor

jrgen-editor is based on [jrgen](https://github.com/mzernetsch/jrgen.git), but abandons the command-line and hosts your json-rpc spec on a node-red server with an embedded text editor for live-editing of the spec in either JSON or YAML. The schema can be saved to the server, so you don't have to worry about losing your work.

For more information on the schema format, check out the repo for [the original](https://github.com/mzernetsch/jrgen.git) jrgen doc generator.

## Docker
The easiest way to run jrgen-editor is by building a Docker image. In the root directory, run  
- `docker build -t jrgen-editor .`   

Then run a container, for example: 
- `docker run -d jrgen-editor`

The uri for the editor is `/jrgen-editor`.

The container will run on port 1880 by default, use `-p` to map to a different port, for example: `docker run -d -p 9100:1880 jrgen-editor`. In this example, you would navigate to the editor by typing `http://localhost:9100/jrgen-editor`.

## Using the flows.json 
You can also import the flows.json file and run it on your local machine. For this to work, you will also have to install the jrgen node. In node-red, navigate to `Manage Palette>Install`, select the `Install` tab and click the upload button; select the supplied .tgz file. Then you will have to copy the `jrgen-editor` directory from the `src` folder into your node-red `data` directory.

## Editing your schema
You can edit the schema in either json or yaml. To change the language, use the `Edit` drop down to select your preferred language. The schema will always be saved to the server as JSON, however, you can download either the JSON or YAML using the `File` drop down. 

The spec will update in real time, but you must explicitly save to the server using the `Save to Server` button. The icon will display green on success, red on an error.

## Getting data from the server
You can query the server for the underlying data.
- **`/jrgen-editor/schema.json`** will return the json schema.  

Note that this doesn't resolve pointers or references. You can use the query parameter **`method`** to get a specific method, which will resolve references within the method defintion, e.g.  
- **`/jrgen-editor/schema.json?method=Session.Login`**

## Generating clients and servers 
jrgen-editor is capable of generating the some of the same files as the original jrgen package. It does this by simply executing the functions provided by jrgen on the server and then making the return available for download. These are all accessible via the `Generate...` drop downs. 