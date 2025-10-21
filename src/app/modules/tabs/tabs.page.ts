import { Component, ViewChild } from '@angular/core';
import { MenuController, IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  currentTab = 'home';
  isMenuOpen = false;

  @ViewChild(IonTabs) tabs!: IonTabs;

  constructor(private menuController: MenuController) {}

  onTabChange(event: any) {
    console.log('Tab changed to: ' + event.tab);
    const selectedTab = event.tab;
    this.currentTab = selectedTab; //ßevent.detail?.tab;
    console.log('Current Tab: ', this.currentTab);
    if (selectedTab === 'tab3') {
      event.preventDefault();
      event.stopPropagation();
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
      console.log('Closing side menu for tab3');
    }
    this.menuController.open('rightMenu').then(() => {
      console.log('Menu opened');
      this.isMenuOpen = true;
    }).catch(err => {
      console.error('Menu open error:', err);
    }); 
  }

}
