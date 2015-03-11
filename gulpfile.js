var gulp = require("gulp");

var ejs = require("gulp-ejs"),
    sass = require("gulp-ruby-sass"),
    pleeease = require("gulp-pleeease"),
    browser = require("browser-sync"),
    notify = require("gulp-notify"),
    plumber = require('gulp-plumber');

var DEV = "app/pc/dev",
    PUBLIC = "app/pc/public";

//ejs
gulp.task("ejs", function() {
    return gulp.src(
        [DEV + "/ejs/**/*.ejs",'!' + DEV + "/ejs/**/_*.ejs"]
    )
        .pipe(plumber())
        .pipe(notify("Found file: <%= file.relative %>!"))
        .pipe(ejs())
        .pipe(gulp.dest(PUBLIC))
        .pipe(browser.reload({stream:true}));
});

//style
gulp.task("style", function() {
    return gulp.src(DEV + "/sass/**/*.scss")
        .pipe(plumber())
        .pipe(notify("Found file: <%= file.relative %>!"))
        .pipe(sass({
            style:"nested",
            compass : true,
            "sourcemap=none": true
        }))
        .pipe(pleeease({
            fallbacks: {
                autoprefixer: ["last 2 version", "ie 9"]
            },
            minifier: false
        }))
        .pipe(gulp.dest(PUBLIC + "/css"))
        .pipe(browser.reload({stream:true}));
});

//copy
gulp.task("js", function() {
    return gulp.src(DEV + "/js/**/*.js")
        .pipe(plumber())
        .pipe(notify("Found file: <%= file.relative %>!"))
        .pipe(gulp.dest(PUBLIC + "/js"));
});

//lib
gulp.task("lib", function() {
    return gulp.src(DEV + "/lib/**/*.js")
        .pipe(plumber())
        .pipe(gulp.dest(PUBLIC + "/lib"));
});

//image
gulp.task("images", function() {
    return gulp.src(DEV + "/images/**/*")
        .pipe(plumber())
        .pipe(gulp.dest(PUBLIC + "/images"));
});

//browser sync
gulp.task("server", function() {
    browser({
        server: {
            baseDir: PUBLIC
        },
        port: 5000
    });
});

//watch
gulp.task("default",["ejs","style","js","lib","images","server"], function() {
    gulp.watch(DEV + "/ejs/**/*.ejs",["ejs"]);
    gulp.watch(DEV + "/sass/**/*.scss",["style"]);
    gulp.watch(DEV + "js/**/*.js",["js"]);
    gulp.watch(DEV + "lib/**/*.js",["lib"]);
    gulp.watch(DEV + "images/**/*",["images"]);
});