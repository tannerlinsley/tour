var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var browserify = require('browserify')
var watchify = require('watchify')
var babel = require('babelify')

var stylus = require('gulp-stylus')
var nib = require('nib')


// ########################################################################
//
// ########################################################################


gulp.task('watch', watch)
gulp.task('build', build)
gulp.task('default', ['build', 'watch'])

function compile(isWatch) {
  var browserified = browserify('./src/tour.js', {
    standalone: 'tour',
    debug: isWatch
  })
    .transform(babel, {
      presets: ["es2015", "react"]
    })

  var bundler = isWatch ? watchify(browserified) : browserified

  function rebundle() {
    return bundler.bundle()
      .on('error', function(err) {
        console.error(err)
        this.emit('end')
      })
      .pipe(source('tour.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist'))
  }

  if (isWatch) {
    bundler.on('update', function() {
      console.log('-> bundling...')
      rebundle()
    })
  }

  rebundle()
}

function build(){
  compile()
  stylusTask()
}

function watch() {
  gulp.watch('./src/tour.styl', stylusTask)
  stylusTask()
  compile(true)
}

function stylusTask() {
  return gulp.src('./src/tour.styl')
    .pipe(stylus({
      use: [nib()],
      compress: true,
    }))
    .pipe(gulp.dest('./dist/'))
}
