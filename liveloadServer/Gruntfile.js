'use strict'
var path = require("path");
var folderMount = function folderMount(connect, point) {
	return connect.static(path.resolve(point));
};

module.exports = function(grunt) {
	grunt.initConfig({
		/**
		 * 监控文件，能够在修改文件的同时刷新页面
		 */
		watch: {
			options: {
				debounceDelay: 250,
				livereload: true
			},
			html: {
				files: grunt.file.readJSON('package.json').htmlPath
			},
			js: {
				files:  grunt.file.readJSON('package.json').jsPath
			},
			css: {
				files:  grunt.file.readJSON('package.json').cssPath
			}
		},
		connect: {
			livereload: {
				options: {
					port: 8080,
					base: grunt.file.readJSON('package.json').base,
					//keepalive:true,
					middleware: function(connect, options) {
						return [
							require("connect-livereload")(),
							folderMount(connect, options.base)
						];
					}
				}
			}
		},
	});

	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	//task
	grunt.registerTask("live", ["connect", "watch"]);

};

