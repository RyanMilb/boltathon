#!/usr/bin/python

import os

#
# Dependencies
#
depdir=os.path.join( os.getcwd(), "public", "vendor" )

depends={
	"JavaScript-MD5": {
		"source" : "https://github.com/blueimp/JavaScript-MD5.git",
		"type" : "git",
		"branch" : "master"
	},
	"did-document" : {
		"source" : "https://github.com/AraBlocks/did-document.git",
		"type" : "git",
		"branch" : "master"
	},
	"chai": {
		"source" : "https://github.com/chaijs/chai.git",
		"type" : "git",
		"branch" : "master"
	}
}

# Check that we have all dependenciies as these should be included as
# git submodules and not stored in the repository
os.chdir(depdir)

for d in depends:

	directory = os.path.join(depdir, d)
	print("serach for {}".format( directory))

	if not os.path.exists( directory ):
		print("folder {} does not exist".format(d))
		print("cloning from git: {} branch: {}".format(depends[d]['source'],depends[d]['branch']))
		os.system("git submodule add -b {} {}".format(depends[d]['branch'],depends[d]['source']))
