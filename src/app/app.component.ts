import { Component } from '@angular/core';


@Component({
    'selector': 'wiki',
    'moduleId': module.id,
    'template':
    `
        <nav>
            <md-toolbar color="primary">
                <span><a uiSref="article" uiSrefActive="active">Articles</a></span>&nbsp;&nbsp;
                <span><a uiSref="user" uiSrefActive="active">Users</a></span>
            </md-toolbar>
        </nav>
        <ui-view></ui-view>
    `
})
export class AppComponent { }
