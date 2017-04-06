/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

 /*
var elixir = require('laravel-elixir');
elixir(function(mix) {
    mix.sass('app.scss');
});
*/

/*
 | 使用cnpm命令代替npm，通过国内源安装组件，防止安装失败
 |--------------------------------------------------------------------------
 | 执行命令： npm install -g cnpm --registry=https://registry.npm.taobao.org
 | 执行命令： cnpm install
 | 执行命令： cnpm install gulp -g
 |--------------------------------------------------------------------------
 */

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    gutil = require('gulp-util'),
    debug = require('gulp-debug'),
    changed = require('gulp-changed');

var staticPath = 'public/static',
    assetsPath = 'resources/assets';


//检验js语法
gulp.task('lint', function() {
    return gulp.src([assetsPath+'/js/**/*.js','!'+assetsPath+'/js/**/*.min.*','!'+assetsPath+'/js/**/zepto-*'])
        .pipe(jshint()) 
        .pipe(jshint.reporter('jshint-stylish')); // 'default' 默认错误提示
});


//压缩js文件
//gulp.task('scripts', ['lint'], function() { 
gulp.task('scripts', function() { //暂时去除JS检验，加快编译速度
    gutil.log('Compressing js files…');
    return gulp.src(assetsPath+'/js/**/*.js')
    	.pipe(changed(staticPath+'/js')) //, {extension: '.js'}
    	.pipe(debug({title: 'Compile:'}))
        .pipe(uglify())
        .pipe(gulp.dest(staticPath+'/js/'));
});


//编译sass文件
gulp.task('sass', function() {
    gutil.log('Compiling sass files…');
    return gulp.src(assetsPath+'/sass/**/*.scss') 
    	.pipe(changed(staticPath+'/css', {extension: '.css'}))
    	.pipe(debug({title: 'Compile:'}))
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest(staticPath+'/css/'));  
});


//压缩图片
gulp.task('imagemin', function () {
    gutil.log('Compressing image files…');
    gulp.src(assetsPath+'/images/**/*.{png,jpg,gif,ico}')
    	.pipe(changed(staticPath+'/images'))
        .pipe(cache(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        })))
        .pipe(debug({title: 'Compile:'}))
        .pipe(gulp.dest(staticPath+'/images'));
});

//默认执行任务
gulp.task('default',['scripts', 'sass', 'imagemin'], function () {
   // gulp.run('scripts', 'sass', 'imagemin');

    //监听js文件变化
    gulp.watch([assetsPath+'/js/**/*.js'], ['scripts']);

    //监听sass文件变化
    gulp.watch([assetsPath+'/sass/**/*.scss'], ['sass']);

    //监听图片文件变化
    gulp.watch([assetsPath+'/images/**/*.{png,jpg,gif,ico}'], ['imagemin']);

});


