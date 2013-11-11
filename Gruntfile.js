module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js',
        'test/**/**/*.js'
      ],
      options: {
        ignores: [
          'src/tmpls/intro.js',
          'src/tmpls/outro.js'
        ],
        // Bad line breaking before '?'.
        '-W014': true,
        // is better written in dot notation.
        '-W069': true
      }
    },
    concat: {
      options: {
        banner: '/*!\n' +
          ' * v<%= pkg.version %>\n' +
          ' * Copyright (c) 2013 Jarid Margolin\n' +
          ' * bouncefix.js is open sourced under the MIT license.\n' +
          ' */ \n\n',
        process: function(src, filepath) {
          if (filepath !== 'src/tmpls/intro.js') {
            // Remove contents between Exclude Start and Exclude End
            src = src.replace( /\/\*\s*ExcludeStart\s*\*\/[\w\W]*?\/\*\s*ExcludeEnd\s*\*\//ig, '');
            // Rewrite module.exports to local var
            src = src.replace(/module.exports\s=/g, 'var');
          }
          // Return final
          return src;
        },
        stripBanners: true
      },
      vanilla: {
        src: [
          'src/tmpls/intro.js',
          'src/bouncefix.js',
          'src/fix.js',
          'src/utils.js',
          'src/eventlistener.js',
          'src/tmpls/outro.js'
        ],
        dest: 'lib/bouncefix.js'
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      vanilla: {
        src: 'lib/bouncefix.js',
        dest: 'lib/bouncefix.min.js'
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Tasks    
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};