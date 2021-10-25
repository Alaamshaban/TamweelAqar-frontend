import { TeamComponent } from './components/team/team.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ServicesComponent } from './components/services/services.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'about-us',
        component: AboutUsComponent
    },
    {
        path: 'blogs',
        component: BlogsComponent
    },
    {
        path: 'contacts',
        component: ContactsComponent
    },
    {
        path: 'team',
        component: TeamComponent
    },
    {
        path: 'services',
        component: ServicesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SharedRoutingModule { }
