
module.exports = function(grunt){

	var banner = grunt.template.process(
		grunt.file.read("src/banner.js"),
		{data: grunt.file.readJSON("package.json")}
	);

	grunt.initConfig({

		less: {
			dev: {
				files: {
					"src/style.css": "src/style.less"
				}
			}
		},

		watch: {
			dev: {
				files: ["src/*.less"],
				tasks: ["less:dev"]
			}
		},

		connect: {
			dev: {
				options: {
					hostname: "localhost",
					port: 8080,
					base: ".",
					keepalive: false
				}
			}
		},

		concat: {
			build: {
				options: {banner: banner},
				files: {
					"dist/tags.js": ["src/tags.js"]
				}
			}
		},

		uglify: {
			build: {
				options: {banner: banner},
				files: {
					"dist/tags.min.js": ["src/tags.js"]
				}
			}
		}

	});

	grunt.registerTask("default", function(){
		console.log(banner);
	});
	grunt.registerTask("dev", ["connect:dev", "watch:dev"]);
	grunt.registerTask("build", ["concat", "uglify"]);

	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");

};