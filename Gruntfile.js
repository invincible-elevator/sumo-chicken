module.exports = function(grunt) {

  grunt.initConfig({

    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'client/js/**/*.js', 'server/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },

    uglify: {
      js: {
        files: {
          'public/build.js': [
            'client/js/player.js',
            'client/js/preload.js',
            'client/js/create.js',
            'client/js/update.js',
            'client/js/game.js'
          ]
        }
      }
    },  

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['build']
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

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('install',
    ['shell:install']
  );

  grunt.registerTask('build',
    ['jshint',
     'uglify']
  );

  grunt.registerTask('start',
    ['build',
     'concurrent']
  );
};