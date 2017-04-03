(function (System: any): void {
    System.config({
        'map': {
            // our app is in the src/app folder
            'app': 'src/app',
            '@angular/core':                     'lib/core.umd.min.js',
            '@angular/common':                   'lib/common.umd.min.js',
            '@angular/compiler':                 'lib/compiler.umd.min.js',
            '@angular/platform-browser':         'lib/platform-browser.umd.min.js',
            '@angular/platform-browser-dynamic': 'lib/platform-browser-dynamic.umd.min.js',
            '@angular/http':                     'lib/http.umd.min.js',
            '@angular/router':                   'lib/router.min.js',
            '@angular/forms':                    'lib/forms.umd.min.js',
            '@angular/material':                 'lib/material.umd.js',
            'ui-router-ng2':                     'lib/ui-router-ng2.min.js',
            'rxjs':                              'lib/rxjs'
        },
        'packages': {
            'app': {
                'defaultExtension': 'js'
            },
            'wiki': {
                'defaultExtension': 'js'
            },
            'rxjs': {
                'defaultExtension': 'js'
            }
        },
        'meta': {
            '*.html': {
                'loader': 'text'
            }
        }
    });
})(System);
