# About JSpective
JSpective is a minimalistic 3D engine implementing a vanishing point projection.

It is based solely on standard text-based web technologies: JavaScript, HTML, CSS.

So web browsers can view spatal web applications without plug-ins
and the front-end is still as text-based as any common webpage.

It is a toy project just for the fun and art.

Project home - including an **online demo** - is  
<a href="https://www.softwareagent.de/jspective">https://www.softwareagent.de/jspective</a>.<br/>

## License
JSpective is free software under the <a target="_blank" href="https://www.tldrlegal.com/license/mit-license">MIT License</a>.

## Install

To deploy JSpective on your local machine or on a webserver
you have two alternative options:

### Deploy from download
1. [Download the Zip-file](https://github.com/dpw0001/jspective/archive/refs/heads/main.zip) from Github: 
2. Unzip and move the content of subdirectory "src" to a target directory of your choice.
3. Open "index.html" in a webbrowser.

### ... or deploy using git
1. Clone needed parts without immediate checkout:
		git clone --no-checkout --depth 1 --sparse https://github.com/dpw0001/jspective.git jspective
2. Change into the newly created directory:
		cd jspective
3. Now checkout "src" directory only:
		git sparse-checkout init --no-cone
		echo "/src/*" > .git/info/sparse-checkout
		git checkout main
4. Move the "src" directory to a target directory of your choice
		mv src MY_NEW_DIR_NAME
5. Open file "MY_NEW_DIR_NAME/index.html" in a webbrowser.

## Dependencies
As its only library dependency, JSpective currently uses <a target="_blank" href="https://jquery.com">jQuery</a>.


Have fun!
Daniel
