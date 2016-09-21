var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
  	return gulp.src('./src/app/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('scripts', function(){
	return gulp.src(['main.js'])
			.pipe(uglify())
			.pipe(gulp.dest('./public/'));
});

gulp.task('browserify', function() {
    // Grabs the app.js file
    return browserify('./src/app/app.js')
        // bundles it and creates a file called main.js
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./public/'));
});

gulp.task('copy', ['browserify'], function() {
    gulp.src(['./src/**/*.html','./src/**/*.css'])
        .pipe(gulp.dest('./public'))
		.pipe(browserSync.stream())
});

gulp.task('build',['lint','copy', 'scripts']);

gulp.task('browser-sync', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: "./public",		
			routes: {
				"/node_modules": "node_modules"
			}
        }
    });
});

gulp.task('default', ['browser-sync'], function(){
	gulp.watch("./src/**/*.*", ["build"]);
	gulp.watch("./public/**/*.*").on('change', browserSync.reload);
});