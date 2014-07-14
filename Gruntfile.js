module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
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
        boss: true,
        eqnull: true,
        node: true,
        globals: {}
      },

      files: ['Gruntfile.js', 'tasks/**/*.js']
    },

    watch: {
      jshint: {
        files: ['tasks/**/*.js', 'Gruntfile.js'],
        tasks: ['jshint']
      }
    }
  });

  grunt.registerTask('watchhint', ['jshint', 'watch:jshint']);
};
