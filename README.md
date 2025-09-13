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

Starting JSpective on a local machine: Since the program is encapsulated as JavaScript modules,
locally opening the file index.html directly from the filesystem will be denied by your webbrowser
(due to modern CORS security policies in browsers).

Thus, you will need to deploy JSpective onto a webserver - be it local or remote - to deliver
the JSpective files for your webbrowser.

### Deploy from download
1. [Download the Zip-file](https://github.com/dpw0001/jspective/archive/refs/heads/main.zip) from Github: 
2. Unzip and move the content of subdirectory "src" to a webserver into a target directory of your choice.
3. Open "index.html" in a webbrowser.

### ... or deploy using git
1. Clone needed parts without immediate checkout:
	```
	git clone --no-checkout --depth 1 --sparse https://github.com/dpw0001/jspective.git jspective
	```
2. Change into the newly created directory:
	```
	cd jspective
	```
3. Now checkout "src" directory only:
	```
	git sparse-checkout init --no-cone
	echo "/src/*" > .git/info/sparse-checkout
	git checkout main
	```
4. Copy the content of the "src" directory to a webserver into a target directory of your choice

5. Open file "index.html" in a webbrowser.

## Dependencies
As its only library dependency, JSpective currently uses <a target="_blank" href="https://jquery.com">jQuery</a>.


Have fun!
Daniel
