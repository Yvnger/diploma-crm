const {src, dest, series, watch} = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const fileInclude = require('gulp-file-include');
const replace = require('gulp-replace');
const typograf = require('gulp-typograf');
const sass = require('gulp-sass')(require('sass'));
const autoPrefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();

const isProduction = process.argv.includes('--production');


const clean = () => {
    return del(['dist']);
}

const resources = () => {
    return src('src/resources/**')
        .pipe(dest('dist'))
}

const styles = () => {
    let stream = src('src/styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat(isProduction ? 'main.min.css' : 'main.css'))
        .pipe(autoPrefixer({ cascade: false }))
        .pipe(cleanCSS({ level: 2 }));

    if (!isProduction) {
        stream = stream
            .pipe(sourcemaps.init())
            .pipe(sourcemaps.write());
    }

    return stream
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
};

const html = () => {
    let stream = src('src/*.html')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(replace('main.css', isProduction ? 'main.min.css' : 'main.css'))
        .pipe(replace('app.js', isProduction ? 'main.min.js' : 'app.js'))
        .pipe(typograf({ locale: ['ru', 'en-US'] }));

    if (isProduction) {
        stream = stream.pipe(htmlMin({ collapseWhitespace: true }));
    }

    return stream
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
};


const svgSprites = () => {
    return src('src/images/svg/**/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(dest('dist/images'))
}

const woff = () => {
    return src(['src/fonts/*.ttf'])
        .pipe(ttf2woff())
        .pipe(dest('dist/fonts'))
}

const woff2 = () => {
    return src(['src/fonts/*.ttf'])
        .pipe(ttf2woff2())
        .pipe(dest('dist/fonts'))
}

// const scripts = () => {
//     let stream = src(['src/js/app.js',])
//         .pipe(babel({ presets: ['@babel/preset-env'] }))
//         .pipe(concat(isProduction ? 'main.min.js' : 'app.js'));
//
//     if (isProduction) {
//         stream = stream.pipe(uglify({ toplevel: true }).on('error', notify.onError()));
//     } else {
//         stream = stream.pipe(sourcemaps.init())
//             .pipe(sourcemaps.write());
//     }
//
//     return stream
//         .pipe(dest('dist'))
//         .pipe(browserSync.stream())
// };

const scripts = () => {
    // let stream = src(['src/js/app.js'])
        // .pipe(sourcemaps.init())  // Инициализация sourcemaps

        // Обработка модульных импортов с помощью Babel
        // .pipe(babel({ presets: ['@babel/preset-env'], plugins: ['@babel/plugin-transform-modules-commonjs'] }))

        // Объединение модулей в один файл
        // .pipe(concat(isProduction ? 'main.min.js' : 'app.js'));

    // if (isProduction) {
        // stream = stream.pipe(uglify({ toplevel: true }).on('error', notify.onError()));
    // }

    // return stream
    //     .pipe(sourcemaps.write())  // Запись sourcemaps
    //     .pipe(dest('dist'))
    return src('src/js/**/*.js')
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
};

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
}

const images = () => {
    return src(['src/images/**/*.jpg', 'src/images/**/*.png', 'src/images/*.svg', 'src/images/**/*.jpeg',])
        .pipe(imagemin([imagemin.gifsicle({interlaced: true}), imagemin.mozjpeg({
            quality: 85,
            progressive: true
        }), imagemin.optipng({optimizationLevel: 5}), imagemin.svgo({
            plugins: [{removeViewBox: true}, {cleanupIDs: false}]
        })]))
        .pipe(dest('dist/images'))
}

const webpConvert = () => {
    return src(['src/images/**/*.jpg', 'src/images/**/*.png', 'src/images/**/*.jpeg'])
        .pipe(webp())
        .pipe(dest('dist/images'))
}

watch('src/**/**.html', html);
watch('src/styles/**/*.scss', styles);
watch('src/images/svg/**/*.svg', svgSprites);
watch('src/js/**/*.js', scripts);
watch('src/resources/**', resources);
watch('src/images/**', images);
watch('src/images/**', webpConvert);
watch('src/fonts/**', woff2);
watch('src/fonts/**', woff);

exports.styles = styles;
exports.clean = clean;
exports.scripts = scripts;
exports.html = html;

exports.default = series(clean, resources, html, scripts, woff2, woff, styles, images, svgSprites, watchFiles);
exports.build = series(clean, resources, html, scripts, woff2, woff, styles, images, svgSprites, watchFiles);