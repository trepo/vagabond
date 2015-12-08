var gulp = require('gulp');
var childProcess = require('child_process');
var ghPages = require('gulp-gh-pages');

gulp.task('build', function() {
  childProcess.execSync('npm run doc');
});

gulp.task('deploy', ['build'], function() {
  return gulp.src(['./doc/**/*', 'CNAME'])
    .pipe(ghPages());
});

gulp.task('default', ['deploy']);
