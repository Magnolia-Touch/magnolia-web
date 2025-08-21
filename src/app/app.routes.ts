import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CleaningComponent } from './components/cleaning/cleaning/cleaning.component';
import { EstimateComponent } from './components/cleaning/estimate/estimate.component';
import { FlowersComponent } from './components/cleaning/flowers/flowers.component';
import { SummaryComponent } from './components/cleaning/summary/summary.component';
import { MemorialComponent } from './components/memorial/memorial/memorial.component';
import { JourneyComponent } from './components/memorial/journey/journey.component';
import { CreateComponent } from './components/memorial/create/create.component';
import { SummaryComponent as MemorialSummaryComponent } from './components/memorial/summary/summary.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cleaning', component: CleaningComponent },
    { path: 'cleaningestimate', component: EstimateComponent },
    { path: 'flowers', component: FlowersComponent },
    { path: 'cleaningsummary', component: SummaryComponent },
    { path: 'memorial', component: MemorialComponent },
    { path: 'memorial-about', component: JourneyComponent },
    { path: 'memorial-create', component: CreateComponent },
    { path: 'memorial-summary', component: MemorialSummaryComponent }
];
