const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const less = require("gulp-less");
const cleanCSS = require("gulp-clean-css");
const concat = require('gulp-concat');

const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const browserify = require("browserify");
const watchify = require("watchify");
const babel = require("babelify");

const paths = {
  less: {
    source: "public/styles/less/*.less",
    destCSSFolder: "public/styles/css",
    destMapFolder: "./maps"
  },
  js: {
    source: [
      "node_modules/@babel/polyfill/dist/polyfill.min.js",
      "public/js/main.js",
      "public/js/main2.js"
    ],
    destMapFolder: "./maps"
  },
  build: {
    destBuildFolder: "dist",
    destCSSFileName: "bundle.min.css",
    destJSFileName: "bundle.min.js"
  }
}

gulp.task("lessToCSS", function (done) {
  gulp.src(paths.less.source)
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(less({ strictMath: true }))
    .pipe(sourcemaps.write(paths.less.destMapFolder))
    .pipe(gulp.dest(paths.less.destCSSFolder));

  done();
});

gulp.task("bundleCSS", function (done) {
  gulp.src(paths.less.destCSSFolder + "/*.css")
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({ debug: true }))
    .pipe(concat(paths.build.destCSSFileName))
    .pipe(sourcemaps.write(paths.less.destMapFolder))
    .pipe(gulp.dest(paths.build.destBuildFolder));

  done();
});

function compile(watch) {
  let bundler = browserify({ entries: paths.js.source }, { debug: true }).transform(babel);

  function rebundle() {
    bundler.bundle()
      .on("error", function (err) { console.error(err); this.emit("end"); })
      .pipe(source(paths.build.destJSFileName))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write(paths.js.destMapFolder))
      .pipe(gulp.dest(paths.build.destBuildFolder));
  }

  if (watch) {
    bundler = watchify(bundler);
    bundler.on("update", function () {
      console.log("Starting 'watch'");
      rebundle();
      console.log("Finshed 'watch'");
    });
  }
  rebundle();
}

function watch() {
  compile(true);
};

gulp.task("js", (done) => {
  compile();
  done();
});
gulp.task("less", gulp.series("lessToCSS", "bundleCSS"), (done) => done());
gulp.task("default", gulp.parallel("js", "less"), (done) => done());

gulp.task("watch", function (done) { watch(); done(); });
