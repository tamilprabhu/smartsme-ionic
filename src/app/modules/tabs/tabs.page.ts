import { Component, ViewChild } from '@angular/core';
import { MenuController, IonTabs } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { canAccessAnyModule, canAccessModule } from 'src/app/utils/module-access.util';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  currentTab = 'home';
  isMenuOpen = false;
  canViewOperations = false;
  canViewReports = false;

  @ViewChild(IonTabs) tabs!: IonTabs;

  constructor(
    private menuController: MenuController,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const userRoles = this.loginService.getUserRoles();
    this.canViewReports = canAccessModule(userRoles, 'REPORTS');
    this.canViewOperations = canAccessAnyModule(userRoles, [
      'STOCK_INWARD',
      'ORDER',
      'INVOICE',
      'DISPATCH',
      'PRODUCTION_SHIFT'
    ]);
  }

  onTabChange(event: any) {
    console.log('Tab changed to: ' + event.tab);
    const selectedTab = event.tab;
    this.currentTab = selectedTab; //ßevent.detail?.tab;
    console.log('Current Tab: ', this.currentTab);
    if (selectedTab === 'menu') {
      // this.menuController.open('rightMenu'); // open right side menu when third tab is clicked
    } else {
      // this.menuController.close('rightMenu'); // close the menu when other tabs selected
    }
  }

  openSideMenu(ev: Event) {
    console.log('evnt: ', ev, ' currentTab: ', this.currentTab);
    if (this.isMenuOpen) {
    //  ev.preventDefault();
    //  ev.stopPropagation();
      this.menuController.close('rightMenu');
      this.isMenuOpen = false;
      console.log('Closing side menu for menu tab');
    }
    this.menuController.open('rightMenu').then(() => {
      console.log('Menu opened');
      this.isMenuOpen = true;
    }).catch(err => {
      console.error('Menu open error:', err);
    }); 
  }

}
