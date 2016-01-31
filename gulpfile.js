var gulp = require("gulp");
var babel = require("gulp-babel");
var sass = require("gulp-sass");
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var notify = require("gulp-notify");
var browser = require("browser-sync");
var plumber = require("gulp-plumber");
var runSequence = require("run-sequence");
var extender = require("gulp-html-extend");
var imagemin = require("gulp-imagemin");

// clean
// ビルドする前のファイルを削除する
gulp.task('clean', function (cb) {
  var rimraf = require('rimraf');
  rimraf('build/**', cb);
});

// server
// ローカルサーバーを起動
gulp.task("server", function() {
  browser({
    server: {
      baseDir: "build"
    }
  });
});

// extend
// HTMLファイルのテンプレート化
gulp.task("extend", function() {
  gulp.src(["dev/**/*.html", "!dev/include/**/*.html"])
  .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
  .pipe(extender({annotations:false,verbose:false}))
  .pipe(gulp.dest('build'))
  .pipe(browser.reload({stream:true}));
});

// babel
// es6をjsファイルに変換
gulp.task("babel", function() {
  gulp.src("dev/js/**/*.es6")
  .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
  .pipe(babel())
  .pipe(uglify())
  .pipe(gulp.dest("build/js"))
  .pipe(browser.reload({stream:true}));
});

// sass
// sassファイルをcssに変換かつ圧縮
gulp.task("sass", function() {
  gulp.src("dev/sass/**/*.scss")
  .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
  .pipe(sass())
  .pipe(minifyCss({compatibility: 'ie8'}))
  .pipe(gulp.dest("build/css"))
  .pipe(browser.reload({stream:true}));
});

// js
// jsファイルを圧縮
gulp.task("js", function() {
  gulp.src("dev/js/**/*.js")
  .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
  .pipe(uglify())
  .pipe(gulp.dest("build/js"))
  .pipe(browser.reload({stream:true}));
});

// image
// 画像ファイルを圧縮
gulp.task("image", function() {
  gulp.src("dev/images/**")
  .pipe(imagemin())
  .pipe(gulp.dest("build/images"))
  .pipe(browser.reload({stream:true}));
});

// copy
// htmlファイルをコピー
gulp.task("copy_html", function() {
  gulp.src("dev/*.html")
  .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
  .pipe(gulp.dest("build"))
  .pipe(browser.reload({stream:true}));
});
// images/以下をコピー
gulp.task("copy_img", function() {
  gulp.src("dev/images/**")
  .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
  .pipe(gulp.dest("build/images"))
  .pipe(browser.reload({stream:true}));
});


// watch
// ファイルを監視
gulp.task("watch", function() {
  gulp.watch("dev/**/*.html", ["extend"]);
  gulp.watch("dev/*.html", ["copy_html"]);
  gulp.watch("dev/images/**", ["copy_img"]);
  gulp.watch("dev/js/**/*.es6",["babel"]);
  gulp.watch("dev/js/**/*.js",["js"]);
  gulp.watch("dev/sass/**/*.scss",["sass"]);
});


// gulp task
// 「gulp」コマンドによる処理を直列処理で実行
gulp.task("default", function() {
  runSequence("clean", ["extend", "sass", "babel", "js", "image", "copy_html", "copy_img"], "watch", "server");
});