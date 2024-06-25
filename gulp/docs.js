const gulp = require("gulp");

const fileInclude = require("gulp-file-include");

const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");

const copy = require("gulp-copy");

const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const webpack = require("webpack-stream");

gulp.task("clean:docs", function (done) {
  if (fs.existsSync("./docs/")) {
    return gulp.src("./docs/", { read: false }).pipe(clean({ force: true }));
  }
  done();
});

const fileIncludeSetting = {
  prefix: "@@",
  basepath: "@file",
};

gulp.task("html:docs", function () {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(gulp.dest("./docs/"));
});

gulp.task("sass:docs", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(gulp.dest("./docs/css/"));
});

gulp.task("images:docs", function () {
  return gulp.src("./src/img/**/*").pipe(copy("./docs/img/", { prefix: 2 }));
});

gulp.task("js:docs", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(webpack(require("./../webpack.config.js")))
    .pipe(gulp.dest("./docs/js/"));
});

const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task("server:docs", function () {
  return gulp.src("./docs/").pipe(server(serverOptions));
});
