import { ref, computed } from 'vue'
import { saveAs } from 'file-saver'
import XLSX from 'xlsx'

// node 環境才能使用模組
const electron = window.require('electron')
const jsonfile = window.require('jsonfile')

export const date = new Date()

export const thead = [
  { label: '日期', attr: 'date', class: 'w-28' },
  { label: '項目', attr: 'name', class: 'w-28' },
  { label: '類型', attr: 'category', class: 'w-10' },
  { label: '收支', attr: 'type', class: 'w-10' },
  { label: '金額', attr: 'money', class: 'pr-2 w-32 text-right font-bold' },
]

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

  clear: function () {
    allDataList.value = []
    this.write()
  },

  export: function (dataList) {
    // convert key
    const exportData = dataList.map(item => {
      const newItem = {}
      thead.forEach(node => { newItem[node.label] = item[node.attr] })
      return newItem
    })

    // create excel workbook
    const sheetName = `${date.getFullYear()}年${date.getMonth() + 1}月`

    const workbook = {
      SheetNames: [ sheetName ],
      Sheets: {
        [sheetName]: XLSX.utils.json_to_sheet(exportData, { header: thead.map(item => item.label), skipHeader: false })
      },
    }

    // create file
    const file = new File([new Blob([changeToBlob(workbook)])], '記帳收支簿.xlsx')
    saveAs(file)

    // convet to excel data
    function changeToBlob (workbook) {
      const rawData = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' })
      const aryBuf = new ArrayBuffer(rawData.length)
      const view = new Uint8Array(aryBuf)
      for (var i = 0; i != rawData.length; ++i) view[i] = rawData.charCodeAt(i) & 0xFF
      return aryBuf
    }
  },
}

operateStore.read()
