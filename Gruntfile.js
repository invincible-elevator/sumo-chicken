module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'client/js/**/*.js', 'server/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },

    nodemon: {
      dev: {
        script: 'server/server.js'
      }
    },

    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      install: {
        command: 'npm install'
      },
    },

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('install',
    ['shell:install']
  );

  grunt.registerTask('start',
    ['jshint',
     'nodemon']
  );
};