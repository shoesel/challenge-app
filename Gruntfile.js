/*jslint node: true */
"use strict";

module.exports = function(grunt) {

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),

		uglify : {
			dist : {
				files : {
					'dist/app.js' : [ 'dist/app.js' ]
				},
				options : {
					mangle : false
				}
			}
		},

		html2js : {
			dist : {
				src : [ 'app/templates/*.html' ],
				dest : 'tmp/templates.js'
			}
		},

		clean : {
			temp : {
				src : [ 'tmp' ]
			},
			dist : {
				src : [ 'dist' ]
			}
		},

		concat : {
			options : {
				separator : ';'
			},
			dist : {
				src : [ 'app/*.js', 'tmp/*.js' ],
				dest : 'dist/app.js'
			}
		},

		jshint : {
			all : [ 'Gruntfile.js', 'app/*.js', 'app/**/*.js' ]
		},

		connect : {
			server : {
				options : {
					hostname : 'localhost',
					port : 8080
				}
			}
		},

		watch : {
			dev : {
				files : [ 'Gruntfile.js', 'app/*.js', 'tests/*.js', 'test-libs/*.js', '*.html', 'app/**/*.html',
						'assets/**/*.scss' ],
				tasks : [ 'jshint', 'karma:unit', 'html2js:dist',
						'concat:dist', 'sass:dev', 'clean:temp' ],
				options : {
					atBegin : true
				}
			},
			min : {
				files : [ 'Gruntfile.js', 'app/*.js', '*.html',
						'assets/**/*.scss' ],
				tasks : [ 'jshint', 'karma:unit', 'html2js:dist',
						'concat:dist', 'sass:dist', 'clean:temp',
						'uglify:dist' ],
				options : {
					atBegin : true
				}
			}
		},

		compress : {
			dist : {
				options : {
					archive : 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
				},
				files : [ {
					src : [ 'index.html', 'dist/*.js', 'dist/*.css',
							'libs/**' ]
				} ]
			}
		},

		sass : {
			dev : {
				options : {
					paths : [ "assets/scss" ]
				},
				files : {
					"dist/style.css" : "assets/scss/style.scss"
				}
			},
			dist : {
				options : {
					sourceMap : true,
					outputStyle : 'compressed'
				},
				files : {
					"dist/style.css" : "assets/scss/style.scss"
				}
			}
		},

		karma : {
			options : {
				configFile : 'config/karma.conf.js'
			},
			unit : {
				singleRun : true
			},
			junit : {
				singleRun : true,
				reporters : [ 'junit', 'coverage' ]
			},
			continuous : {
				singleRun : false,
				autoWatch : true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.loadNpmTasks('grunt-karma');

	grunt.registerTask('dev', [ 'clean:dist', 'connect:server', 'watch:dev' ]);
	grunt.registerTask('test', [ 'clean:dist', 'jshint', 'karma:continuous' ]);
	grunt.registerTask('junit', [ 'clean:dist', 'jshint', 'karma:junit' ]);
	grunt.registerTask('minified', [ 'clean:dist', 'connect:server',
			'watch:min' ]);
	grunt.registerTask('package', [ 'clean:dist', 'jshint', 'karma:unit',
			'html2js:dist', 'concat:dist', 'uglify:dist', 'sass:dist',
			'clean:temp', 'compress:dist' ]);
};
