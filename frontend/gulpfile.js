const gulp = require('gulp');
const nodeSass = require('node-sass');
const sass = require('gulp-sass')(nodeSass);
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const rimraf = require('rimraf')

gulp.task('sass', function(done) {
  gulp.src('./assets/sass/**/*.scss')
    .pipe(sass({ sourceMap: true })).on('error', sass.logError)
    .pipe(gulp.dest('./public/stylesheets'))

  done()
})

gulp.task('autoprefixer', function(done) {
  gulp.src('./public/stylesheets/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/stylesheets'))
  
  done()
})

gulp.task('clean-public', function(done) {
  rimraf.sync('./public')
  done()
})

gulp.task('generate-assets', gulp.series('clean-public', 'sass', 'autoprefixer'))
