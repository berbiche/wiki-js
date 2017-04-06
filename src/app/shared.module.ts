import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { UIRouterModule } from 'ui-router-ng2';
import { CommonModule } from '@angular/common';

@NgModule({
    'exports': [
        CommonModule,
        HttpModule,
        UIRouterModule
    ]
})
export class SharedModule {}
