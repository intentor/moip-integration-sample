var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');
var livereload = require('gulp-livereload');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');

// Generate the main script file.
gulp.task('scripts', function() {
	gulp.src([
			'assets/vendor/bootstrap/javascripts/bootstrap.js',
			'assets/scripts/**/*.js',
		])
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'));
});

// Generate CSS files from SASS.
gulp.task('styles', function() {
	sass('assets/sass/styles.scss', 
		{ 
        	style: 'compressed',
        	sourcemap: false,
        	loadPath: [
                 'assets/vendor/bootstrap/stylesheets',
                 'assets/sass'
             ]
        })
        .on('error', function (err) { console.log(err.message); })
        .pipe(rename({basename: 'app', suffix: '.min'}))
        .pipe(gulp.dest('public/css'));
});

//Watches files for updates and executes the tasks accordingly.
gulp.task('watch', function() {
	//Starts listening.
	livereload.listen();
	 
	// Watch view files.
	gulp.watch('views/**/*.ejs').on('change', function(file) {
		livereload.changed('');
	});

	// Watch CSS files.
	gulp.watch('public/css/*.css').on('change', function(file) {
		livereload.changed('');
	});

	// Watch JS files.
	gulp.watch('public/js/*.js').on('change', function(file) {
		livereload.changed('');
	});
  
	// Watch SASS/CSS files.
	gulp.watch('assets/sass/**/*.scss', ['styles']);

	// Watch scripts files.
	gulp.watch('assets/scripts/**/*.js', ['scripts']);	
});