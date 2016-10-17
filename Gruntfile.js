/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['dev/javascripts/js/*.js'],
        dest: 'dev/javascripts/concatenated/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dev/javascripts/compiled/<%= pkg.name %>.min.js'
      }
    },
    copy: {
      css: {
        src: 'dev/stylesheets/compiled/style.css',
        dest: 'public/stylesheets/style.css',
        options: {
          process: function (content) {
            return content.replace(/\n\n\/\*# sourceMappingURL=.*\.css\.map \*\//g, '');
          }
        }
      },
      js: {
        src: '<%= uglify.dist.dest %>',
        dest: 'public/javascripts/<%= pkg.name %>.min.js'
      },
      md5: {
        src: 'node_modules/js-md5/build/md5.min.js',
        dest: 'public/javascripts/md5.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer')
        ]
      },
      dist: {
        src: 'dev/stylesheets/compiled/style.css'
      }
    },
    sass: {
      dist: {
        options: {
          update: true
        },
        files: {
          'dev/stylesheets/compiled/style.css': 'dev/stylesheets/scss/main.scss'
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      stylesheets: {
        files: ['dev/stylesheets/scss/*.scss'],
        tasks: ['sass', 'postcss', 'copy:css']
      },
      javascripts: {
        files: ['dev/javascripts/js/*.js'],
        tasks: ['concat', 'uglify', 'copy:js']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');

  // Default task. Builds static .css and .js files.
  grunt.registerTask('default', ['sass', 'concat', 'uglify', 'copy']);

};
