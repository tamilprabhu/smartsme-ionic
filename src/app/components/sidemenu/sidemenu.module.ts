import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidemenuComponent } from './sidemenu.component';
import { LoginService } from 'src/app/services/login.service';
import { AppModule } from 'src/app/app.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        AppModule
    ],
    declarations: [
        SidemenuComponent
    ],
    providers: [LoginService],
    exports: [
        SidemenuComponent
    ]
})
export class SidemenuModule {}