const gulp = require('gulp');
const cssFormat = require('gulp-css-format');
const del = require('del');
const runSequence = require('gulp4-run-sequence');
const rename = require('gulp-rename');

gulp.task('css', () => {
  return gulp
    .src('src/css/index.css')
    .pipe(cssFormat({ indent: 1, hasSpace: true }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('image', () => {
  return gulp.src('src/img/*').pipe(gulp.dest('dist/img/'));
});

gulp.task('js', () => {
  return gulp.src('src/emojis.wx.js').pipe(rename('index.js')).pipe(gulp.dest('dist/'));
});

gulp.task('clean', () => del(['dist/*'], { dot: true }));

gulp.task(
  'default',
  gulp.series(['clean'], cb => {
    runSequence(['css', 'image', 'js'], cb);
    cb();
  })
);
