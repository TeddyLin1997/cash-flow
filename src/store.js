import { ref, computed } from 'vue'
const electron = window.require('electron')
const jsonfile = window.require('jsonfile')

// system userdata path
const userDataPath = (electron.app || electron.remote.app).getPath('userData') + '/' + 'store.json'

// userData
export const typeList = ['收入', '支出']
export const allDataList = ref([])

const income = computed(() => allDataList.value.filter((item) => item.type === typeList[0]).reduce((acc, curr) => acc + curr.money, 0))
const pay = computed(() => allDataList.value.filter((item) => item.type === typeList[1]).reduce((acc, curr) => acc + Math.abs(curr.money), 0))
const total = computed(() => income.value - pay.value)

export const useAssets = () => ({ income, pay, total })

// store operate
export const operateStore = {
  write: function () { 
    return jsonfile.writeFile(userDataPath, allDataList.value)
  },

  read: async function () {
    allDataList.value = await jsonfile.readFile(userDataPath)
      .then(res => res)
      .catch(() => [])
  },

  delete: function (row) {
    const targetIndex = allDataList.value.findIndex(item => item === row)
    allDataList.value.splice(targetIndex, 1)
    this.write()
  },

  add: function (row) {
    const item = {
      timeStamp: dayjs(row.date).valueOf(),
      date: dayjs(row.date).format('YYYY/MM/DD'),
      category: row.category,
      type: row.type,
      name: row.name,
      money: row.type === typeList[0] ? +row.money : -row.money
    }

    allDataList.value.push(item)
    this.write()
  },
}

operateStore.read()
