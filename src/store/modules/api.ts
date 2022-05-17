import { ApiModuleType } from '/#/store'
import { getUserApis } from '@/api/user'

export const useApiStore = defineStore('api', {
  state: (): ApiModuleType => ({
    apis: [],
    buttons: [],
  }),
  getters: {
    getApis: (state) => state.apis,
    getButtons: (state) => state.buttons,
  },
  actions: {
    async setApis() {
      const {
        data: { list },
      } = await getUserApis()
      this.apis = list
      this.buttons = list
    },
    checkButtonPermission(url: string, method: string) {
      const button = this.buttons.find((item) => {
        return item.path === url && item.method === method
      })
      return button && button.path !== ''
    },
  },
})
