const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const less = require("gulp-less");
const cleanCSS = require("gulp-clean-css");
const concat = require('gulp-concat');

const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const browserify = require("browserify");
const babel = require("babelify");

const paths = {
  less: {
    watchFiles: "public/styles/*.less",
    source: [
      "public/styles/mainStyle.less",
      "public/styles/mainStyle2.less"
    ],
    destMapFolder: "./maps"
  },
  js: {
    watchFiles: "public/js/*.js",
    source: [
      "node_modules/@babel/polyfill/dist/polyfill.min.js",
      "public/js/main.js",
      "public/js/main2.js"
    ],
    destMapFolder: "./maps"
  },
  build: {
    destBuildFolder: "dist",
    destMinCSSFileName: "bundle.min.css",
    destMinJSFileName: "bundle.min.js"
  }
}

gulp.task("less", (done) => {
  gulp.src(paths.less.source)
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(less({ strictMath: true })) // .pipe(gulp.dest(paths.less.destCSSFolder)) // if for some reason css is needed, then uncomment this
    .pipe(cleanCSS({ debug: true }))
    .pipe(concat(paths.build.destMinCSSFileName))
    .pipe(sourcemaps.write(paths.less.destMapFolder))
    .pipe(gulp.dest(paths.build.destBuildFolder));

  done();
});

gulp.task("js", (done) => {
  const bundler = browserify({ entries: paths.js.source }, { debug: true }).transform(babel);
  bundler.bundle()
    .on("error", function (err) { console.error(err); this.emit("end"); })
    .pipe(source(paths.build.destMinJSFileName))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write(paths.js.destMapFolder))
    .pipe(gulp.dest(paths.build.destBuildFolder));

  done();
});

function watchFiles() {
  gulp.watch(paths.js.watchFiles, gulp.series("js"));
  gulp.watch(paths.less.watchFiles, gulp.series("less"));
}

gulp.task("watch", gulp.series(watchFiles), (done) => done());
gulp.task("default", gulp.series("less", "js"), (done) => done());
