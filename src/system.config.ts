(function (global) {
    let packages = {
        'app': {
            'defaultExtension': 'js'
        }
    }

    let map = {
        // our app is in the dist/src/app folder
        'app': 'src/app',

        '@angular/core': 'lib:core.umd.min.js',
        '@angular/common': 'lib:common.umd.min.js',
        '@angular/forms': 'lib:forms.umd.min.js',
        '@angular/http': 'lib:http.umd.min.js',
        '@angular/material': 'material.umd.js',
        '@angular/platform-browser': 'lib:platform-browser.umd.min.js',
        '@angular/platform-browser-dynamic': 'lib:platform-browser-dynamic.min.js',
        '@angular/router': 'lib:router.min.js',
        'ui-router-ng2': 'lib:ui-router-ng2.min.js',
        'rxjs': 'lib:Rx.min.js'
    }

    ngPackageNames.forEach(setPackageConfig);

    System.config({
        'baseURL': '/dist',
        'paths': {
            'lib': 'lib'
        },
        'map': map,
        'packages': packages
    });
})(this);
