const {src, dest, parallel, series, watch} = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser').default;
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const imagemin = require('gulp-imagemin'); /* Minify PNG, JPEG, GIF and SVG images  */

/* styles function for the site */
function stylesFunc() {
	return src('assets/source/css/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(concat('main.min.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 versions'],
			grid: true
		}))
		.pipe(cleanCSS({
			level: {
				1: {
					specialComments: 0
				}
			}
		}))
		.pipe(sourcemaps.write('maps/'))
		.pipe(dest('assets/dist/css/'))
}

/* styles func for WP (admin panel) */
function stylesFuncWP() {
	return src('assets/source/css/admin.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(concat('admin.min.css'))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 versions'],
			grid: true
		}))
		.pipe(cleanCSS({
			level: {
				1: {
					specialComments: 0
				}
			}
		}))
		.pipe(sourcemaps.write('maps/'))
		.pipe(dest('assets/dist/css/'))
}

/* JS function for the site */
function scriptsFunc() {
	return src([
		'assets/source/js/**/*.js'
	])
		.pipe(concat('main.min.js'))
		.pipe(terser())
		.pipe(dest('assets/dist/js/'))
}

/* image minimization function */
function imagesFunc() {
	return src([
		'assets/source/images/**/*'
	])
		.pipe(imagemin())
		.pipe(dest('assets/dist/images/'))
}

function cleanBuildFunc() {
	return del('assets/dist/**/*', {force: true})
}

function startWatchFunc() {
	watch('assets/source/css/**/*', stylesFunc);
	watch('assets/source/js/**/*.js', scriptsFunc);
}

exports.scriptsTask = scriptsFunc;
exports.stylesTask = stylesFunc;
exports.imagesTask = imagesFunc;
exports.stylesWPTask = stylesFuncWP;

exports.default = parallel(stylesFunc, scriptsFunc, imagesFunc, stylesFuncWP, startWatchFunc);
exports.build = series(cleanBuildFunc, stylesFunc, scriptsFunc, imagesFunc, stylesFuncWP);

