var gulp 		= require('gulp');
var browserSync = require('browser-sync');
var del 		= require('del');
var vinylPaths  = require('vinyl-paths');
var typescript 	= require('gulp-typescript');
var concat 		= require('gulp-concat');
var browserify 	= require('browserify');
var tsify 		= require('tsify');
var source 		= require('vinyl-source-stream');
var buffer 		= require('vinyl-buffer');

gulp.task('hello', function()
{
	console.log('I`m here!');
});

gulp.task('copyIndex', function()
{
	return gulp.src('src/index.html')
	.pipe(gulp.dest('./shinyApp/www'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('copyCss', function()
{
	return gulp.src('src/*.css')
			.pipe(gulp.dest('./shinyApp/www'))
			.pipe(browserSync.reload({stream: true}));
});

gulp.task('copyJson', function()
{
	return gulp.src('src/*.json')
			.pipe(gulp.dest('./shinyApp/www'))
			.pipe(browserSync.reload({stream: true}));
});

gulp.task('browserSync', function()
{
	browserSync({
		server: {
			baseDir: './shinyApp/www'
		}
	});
});

gulp.task('watchFiles', function()
{
	gulp.watch('src/index.html', ['copyIndex']);
	gulp.watch('src/**/*.ts', ['typescriptIt']);
});

gulp.task('typescriptIt', function()
{
	browserify('./src/App.ts')
		.plugin(tsify)
		.bundle()
		.pipe(source('App.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./shinyApp/www'));
});

gulp.task('clean', function()
{
	return gulp.src('./shinyApp/www', {read: false})
			.pipe(vinylPaths(del));
});


gulp.task('default', ['clean', 'copyIndex', 'copyCss', 'copyJson', 'typescriptIt', 'browserSync', 'watchFiles']);