# About JSpective
JSpective is a minimalistic 3D engine implementing a vanishing point projection.

It is based solely on standard text-based web technologies: JavaScript, HTML, CSS.

So web browsers can view spatial web applications without plug-ins
and the front-end is still as text-based as any common webpage.

It is a toy project just for the fun and art.

Project home - including an **online demo** - is  
<a href="https://www.softwareagent.de/jspective">https://www.softwareagent.de/jspective</a>.<br/>

## License
JSpective is free software under the <a target="_blank" href="https://www.tldrlegal.com/license/mit-license">MIT License</a>.

## Install

JSpective can be deployed onto webservers.

Starting JSpective on a local machine: Since the program is encapsulated in JavaScript modules,
locally opening the file index.html directly from the filesystem will be denied by your webbrowser
(due to modern CORS security policies in browsers).

Thus, you will need to deploy JSpective onto a webserver - be it local or remote - to deliver
the JSpective files for your webbrowser.

Here are two alternative methods to deploy JSpective on a webserver:

### Install JSpective via download
This is the easiest method - and does not require a Github account ...

1. [Download the Zip-file](https://github.com/dpw0001/jspective/archive/refs/heads/main.zip) from Github: 
2. Unzip and copy the content of subdirectory "src" to a webserver into a target directory of your choice.
3. Open "index.html" in a webbrowser.

### ... or install JSpective as npm package
To fetch npm packages from Github, you unfortunately need a Github account - and Access Token ...

1. Setup your npm client to use the Githup registry with an Access Token (see Github docs).
2. Fetch the npm package into a directory of your webserver.
	```
	cd my_target_dir
	npm install @dpw0001/jspective
	```
3. Open the file "my_target_dir/node_modules/@dpw0001/jspective/index.html" in a webbrower.
4. Optional: To cleanup, move the subdirectory "jspective/" with its content directly into "my_target_dir/" and then remove the unnecessary folders.
	```
	mv node_modules/@dpw0001/jspective ./
	rm -r node_modules
	```

## Dependencies
As its only library dependency, JSpective currently uses <a target="_blank" href="https://jquery.com">jQuery</a>.


Have fun!
Daniel
