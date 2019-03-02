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
    source: [
      "public/styles/less/mainStyle.less",
      "public/styles/less/mainStyle2.less"
    ],
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

function compile(watch) {
  let bundler = browserify({ entries: paths.js.source }, { debug: true }).transform(babel);

  function rebundle() {
    bundler.bundle()
      .on("error", function (err) { console.error(err); this.emit("end"); })
      .pipe(source(paths.build.destMinJSFileName))
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
gulp.task("default", gulp.series("js", "less"), (done) => done());

gulp.task("watch", function (done) { watch(); done(); });
