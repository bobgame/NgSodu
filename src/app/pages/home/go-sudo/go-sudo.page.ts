import { Component, OnInit } from '@angular/core';
import { SudoService } from '../../../service/sudo/sudo.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LanService } from '../../../service/lan/lan.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-go-sudo',
  templateUrl: './go-sudo.page.html',
  styleUrls: ['./go-sudo.page.scss'],
})
export class GoSudoPage implements OnInit {

  sudoPlay = {
    playId: 123,
  }
  hardModeName: string[]
  continueButton: boolean
  LanData
  constructor(
    private sudoService: SudoService,
    private router: Router,
    private storage: Storage,
    private lanService: LanService,
    private events: Events,
  ) {
    this.sudoPlay.playId = Math.floor(Math.random() * 1000)
    this.sudoPlay = this.sudoService.SudoPlay
    this.hardModeName = this.sudoService.hardModeName

    lanService.getLanguage().then(() => {
      if (lanService.LanData) {
        this.LanData = lanService.LanData
        this.hardModeName = [this.LanData.common.starter, this.LanData.common.normal, this.LanData.common.master]
      } else {
        lanService.getLanJson()
          .subscribe((data) => {
            this.LanData = data
            this.hardModeName = [this.LanData.common.starter, this.LanData.common.normal, this.LanData.common.master]
          })
      }
    })
    events.subscribe('lan:dataChange', (data) => {
      this.LanData = data
    })
  }

  ngOnInit() {
    this.storage.get('sd-data').then((data) => {
      if (data) {
        if (data.sudoArr.length > 0) { this.continueButton = true }
      } else {
        this.continueButton = false
      }
    })
  }

  continueSudo() {
    this.router.navigate([`/play/${this.sudoPlay.playId}`])
  }

  goToSudo(index: number) {
    this.sudoService.createNewGame(index)
    this.router.navigate([`/play/${this.sudoPlay.playId}`])
  }

}