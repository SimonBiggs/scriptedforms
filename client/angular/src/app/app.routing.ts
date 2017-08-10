import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { Angulartics2GoogleAnalytics, Angulartics2Module } from 'angulartics2';

import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { RecordComponent } from './record/record.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component'
import { TrendComponent } from './trend/trend.component';
import { ShareComponent } from './share/share.component';


const appRoutes: Routes = [
  {
    path: '',
    component: EditComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'record',
    component: RecordComponent
  },
  {
    path: 'view',
    component: ViewComponent
  },
  {
    path: 'edit',
    component: EditComponent
  },
  {
    path: 'trend',
    component: TrendComponent
  },
  {
    path: 'share',
    component: ShareComponent
  },
  {
    path: '**', component: PageNotFoundComponent
  }
];

export const appRoutingProviders: any[] = [
  //Angulartics2GoogleAnalytics
];

export const RoutingModule: ModuleWithProviders = RouterModule.forRoot(appRoutes);
