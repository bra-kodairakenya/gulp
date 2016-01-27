var gulp = require("gulp");
var babel = require("gulp-babel");
var sass = require("gulp-sass");
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var browser = require("browser-sync");
var plumber = require("gulp-plumber");
var runSequence = require("run-sequence");
var extender = require("gulp-html-extend");

// clean
gulp.task('clean', function (cb) {
  var rimraf = require('rimraf');
  rimraf('build/**', cb);
});

// server
gulp.task("server", function() {
  browser({
    server: {
      baseDir: "build"
    }
  });
});

// extend
gulp.task("extend", function() {
  gulp.src(["dev/**/*.html", "!dev/include/**/*.html"])
  .pipe(plumber())
  .pipe(extender({annotations:false,verbose:false}))
  .pipe(gulp.dest('build'));
});

// babel
gulp.task("babel", function() {
  gulp.src("dev/js/**/*.es6")
  .pipe(plumber())
  .pipe(babel())
  .pipe(uglify())
  .pipe(gulp.dest("build/js"));
});

// sass & autoprefix & glup-frontnote
gulp.task("sass", function() {
  gulp.src("dev/sass/**/*.scss")
  .pipe(plumber())
  .pipe(sass())
  .pipe(minifyCss({compatibility: 'ie8'}))
  .pipe(gulp.dest("build/css"));
});

// js
gulp.task("js", function() {
  gulp.src("dev/js/**/*.js")
  .pipe(plumber())
  .pipe(uglify())
  .pipe(gulp.dest("build/js"));
});

// copy
gulp.task("copy_html", function() {
  gulp.src("dev/*.html")
  .pipe(plumber())
  .pipe(gulp.dest("build"));
});

gulp.task("copy_img", function() {
  gulp.src("dev/images/**")
  .pipe(plumber())
  .pipe(gulp.dest("build/images"));
});


// watch
gulp.task("watch", function() {
  gulp.watch("dev/**/*.html", ["extend"]);
  gulp.watch("dev/*.html", ["copy_html"]);
  gulp.watch("dev/images/**", ["copy_img"]);
  gulp.watch("dev/js/**/*.es6",["babel"]);
  gulp.watch("dev/js/**/*.js",["js"]);
  gulp.watch("dev/sass/**/*.scss",["sass"]);
});


// gulp task
gulp.task("default", function() {
  runSequence("clean", ["extend", "sass", "babel", "js", "copy_html", "copy_img"], "watch", "server");
});