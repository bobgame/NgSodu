import { Component, OnInit } from '@angular/core';
import { SoduService } from '../../../service/sodu/sodu.service';
import { LanService } from '../../../service/lan/lan.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  soduPlay = {
    playId: 123,
  }
  LanData
  constructor(
    private soduService: SoduService,
    private lanService: LanService,
    private events: Events,
  ) {
    this.soduPlay.playId = Math.floor(Math.random() * 1000)
    this.soduPlay = this.soduService.SoduPlay

    lanService.getLanguage().then(() => {
      if (this.lanService.LanData) {
        this.LanData = this.lanService.LanData
      } else {
        this.lanService.getLanJson()
          .subscribe((data) => { this.LanData = data })
      }
    })

    events.subscribe('lan:dataChange', (data) => {
      this.LanData = data
    })
  }

  ngOnInit() { }

  // for test used
  clearData() {
    this.soduService.clearData()
  }

}
