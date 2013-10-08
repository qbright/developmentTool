var Tar = require('tar-async'), // or require('tar-async').Tar or require('tar-async/tar')
    file = require("file"),
	foreach = require("foreach"),
	path = require("path"),
	fs = require("fs"),
	targetPath,
	tarName;

if(process.argv.length < 3){
	console.log("please input the targt Path");
	process.exit(1);
}else{
	targetPath = process.argv[2];
	if(process.argv.length > 3){
		tarName = process.argv[3];
	}else{
		tarName = targetPath + ".tar";
	}
}
tape = new Tar({output: require('fs').createWriteStream(tarName)});
file.walkSync(targetPath,function(dir,b,files){
	foreach(files,function(file){
		var fileSource = fs.readFileSync(path.join(dir,file)).toString();
		tape.append(path.join(dir,file),fileSource);
	});	
})
tape.close();
