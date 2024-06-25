const gulp = require("gulp");

const fileInclude = require("gulp-file-include");

const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");

const copy = require("gulp-copy");

const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const webpack = require("webpack-stream");

gulp.task("clean:dev", function (done) {
  if (fs.existsSync("./build/")) {
    return gulp.src("./build/", { read: false }).pipe(clean({ force: true }));
  }
  done();
});

const fileIncludeSetting = {
  prefix: "@@",
  basepath: "@file",
};

gulp.task("html:dev", function () {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(gulp.dest("./build/"));
});

gulp.task("sass:dev", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(gulp.dest("./build/css/"));
});

gulp.task("images:dev", function () {
  return gulp.src("./src/img/**/*").pipe(copy("./build/img/", { prefix: 2 }));
});

gulp.task("js:dev", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(webpack(require("./../webpack.config.js")))
    .pipe(gulp.dest("./build/js/"));
});

const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task("server:dev", function () {
  return gulp.src("./build/").pipe(server(serverOptions));
});

gulp.task("watch:dev", function () {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass:dev"));
  gulp.watch("./src/html/**/*.html", gulp.parallel("html:dev"));
  gulp.watch("./src/img/**/*", gulp.parallel("images:dev"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("js:dev"));
});
