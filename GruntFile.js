module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    build_directory: './dist',
    uglify: {
      prod: {
        options: {
          banner: '/* Sal Version <%= pkg.version %> */',
          reserveDOMProperties: true,
          sourceMap: true,
          sourceMapIn: 'dist/prod/sal-bundle.js.map',
          compress: {
            sequences: true,
            dead_code: true,
            drop_debugger: true,
            comparisons: true,
            conditionals: true,
            evaluate: true,
            booleans: true,
            loops: true,
            unused: true,
            hoist_funs: true,
            if_return: true,
            join_vars: true,
            cascade: true,
            drop_console: true
          }
        },
        files: {
          'dist/<%= pkg.name %>.js': ['dist/<%= pkg.name %>.js']
        }
      },
    },
    clean: {
      build: ['<%= build_directory %>'],
    },
    shell: {
      transterAdmin: {
        command: 'copy build\\dev\\AdminInterface.js C:\\inetpub\\wwwroot\\eSalWebApp\\public\\js'
      },
      transferSuperviser: {
        command: 'copy build\\dev\\SuperviserInterface.js C:\\inetpub\\wwwroot\\eSalWebApp\\public\\js'
      },
      transferUser: {
        command: 'copy build\\dev\\UserInterface.js C:\\inetpub\\wwwroot\\eSalWebApp\\public\\js'
      },
      transferReg: {
        command: 'copy build\\dev\\Registration.js C:\\inetpub\\wwwroot\\eSalWebApp\\public\\js'
      }
    },
    connect: {
      docs: {
        options: {
          port: 8500,
          base: ['./docs'],
          keepalive: true,
          open: 'http://localhost:8500/index.html'
        }
      }
    },
    browserify: {
      dist: {
        files: {
          'build/dev/UserInterface.js': ['src/Runtime/runtime.user.js'],
          'build/dev/SuperviserInterface.js': ['src/Runtime/runtime.superviser.js'],
          'build/dev/AdminInterface.js': ['src/Runtime/runtime.admin.js']
        }
      },
      dev: {
        files: {
          'build/dev/UserInterface.js': ['src/Runtime/runtime.user.js'],
          'build/dev/SuperviserInterface.js': ['src/Runtime/runtime.superviser.js'],
          'build/dev/AdminInterface.js': ['src/Runtime/runtime.admin.js'],
          'build/dev/Registration.js': ['src/Runtime/runtime.registration.js']
        }
      }
    },
    jsdoc: {
      dist: {
        src: ['src/*'],
        options: {
          destination: 'docs'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-shell');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('docs', ['jsdoc']);
  grunt.registerTask('build-dev', ['clean:build', 'browserify:dev', 'shell:transterAdmin', 'shell:transferSuperviser', 'shell:transferUser', 'shell:transferReg']);
  grunt.registerTask('show-docs', ['docs','connect:docs']);
};