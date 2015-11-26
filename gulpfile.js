var gulp = require("gulp");
var babel = require("gulp-babel");
var fs = require("fs");
var path = require("path");

gulp.task('clean', function(){
    function rmRec(pathToFile) {
        if(fs.lstatSync(pathToFile).isDirectory()) {
            fs.readdirSync(pathToFile).forEach(function(fileName){
                var file = path.join(pathToFile, fileName);
                rmRec(file);
            });
            fs.rmdirSync(pathToFile);
        } else {
            fs.unlinkSync(pathToFile);
        }
    }
    fs.readdirSync(path.join(__dirname, "build")).forEach(function(file) {
        rmRec(path.join(__dirname, "build", file));
    });
});

gulp.task('build', function(){
    return gulp.src("src/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("build"));
});

gulp.task("watch", function(){
    gulp.watch("src/**/*.js", ['build']);
});

gulp.task('default', ['clean', 'build', 'watch']);
