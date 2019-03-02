# gulp-babel-browserify
A simple setup for `gulp@4.0.0`, `babel@7.3.4`, `browserify@16.2.3`

Just clone or download this repository.
- Run `npm i`
- Run `gulp`  -- This will run `gulp default` tasks

All available tasks
- `gulp js`
- `gulp less`
- `gulp watch`
- `gulp default`

gulp js
=> Takes all .js files from specified path
=> Creates sourcemaps
=> Minifies
=> Adds to dist folder

gulp less
=> Takes all less files from specified path
=> Creates sourcemaps
=> Minifies
=> Adds to dist folder

For dev, directly open `index.html` using any browser
