import { Component, OnInit } from '@angular/core';
import { RankService } from '../../service/rank/rank.service';
import { SettingService } from '../../service/setting/setting.service';
import { LanService } from '../../service/lan/lan.service';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.page.html',
  styleUrls: ['./rank.page.scss'],
})
export class RankPage implements OnInit {

  rankData = {
    'starterStar': [],
    'normalStar': [],
    'masterStar': [],
  }
  showDataName = 'starterStar'
  rankShow = {
    nav: '',
    ready: false,
    dataReady: false
  }
  settings = {
    Lang: '',
    sudo: {
      userid: '',
      username: ''
    }
  }
  LanData

  constructor(
    private rankService: RankService,
    private settingService: SettingService,
    private lanService: LanService,
    private events: Events,
    private storage: Storage,
  ) {
    this.rankShow = this.rankService.RankShow
    this.lanService.getLanguage().then(() => {
      if (this.lanService.LanData) {
        this.LanData = this.lanService.LanData
      } else {
        this.lanService.getLanJson()
          .subscribe((data) => {
            this.LanData = data
          })
      }
    })
    this.events.subscribe('lan:dataChange', (data) => {
      this.LanData = data
    })

    this.loadSettingDatas()
  }

  ngOnInit() {
  }

  getRankDatas(userid: string) {
    this.getRankData('starterStar', userid)
    this.getRankData('normalStar', userid)
    this.getRankData('masterStar', userid)
  }

  getRankData(sortName: string, userid: string) {
    this.rankService.getRankData(sortName, userid)
      .subscribe((data) => {
        this.rankData[sortName] = data
        console.log(this.rankData)
        this.rankShow.dataReady = true
      })
  }

  createRank(name: string) {
    this.storage.get('sd-data').then((data) => {
      if (data) {
        this.rankService.createRank(name, data).subscribe((res) => {
          // console.log(res)
          this.settings.sudo.userid = res.userid
          this.settings.sudo.username = res.username
          this.settingService.saveSettingDatas()
          this.getRankDatas(res.userid)
        })
      }
    })
  }

  switchTab(tabName: string) {
    this.rankShow.nav = tabName + 'Star'
    this.showDataName = tabName + 'Star'
  }

  loadSettingDatas() {
    return this.settingService.loadSettingDatas().then((data) => {
      this.settings = this.settingService.settings
      if (this.settings.sudo.userid !== '') {
        this.getRankDatas(this.settings.sudo.userid)
      }
      this.rankShow.ready = true
    })
  }

}
