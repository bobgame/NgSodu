import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(
    private storage: Storage,
  ) { }

  settings: any

  async loadSettingDatas() {
    // 读取成就等 load game datas
    return this.storage.get('sd-setting').then((setting) => {
      const settingDefault = {
        Lang: '',
        sodu: {
        }
      }
      if (setting) {
        this.settings = setting
      } else {
        this.settings = settingDefault
      }
      this.saveSettingDatas()
    })
  }
  saveSettingDatas() {
    this.storage.set('sd-setting', this.settings)
  }
}
