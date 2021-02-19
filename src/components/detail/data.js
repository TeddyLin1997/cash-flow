const jsonfile = window.require('jsonfile')

export default {
  write: (content) => jsonfile.writeFile(`${process.cwd()}tmp/data.json`, content),
  read: () => {
    return jsonfile.readFile(`${process.cwd()}tmp/data.json`)
      .then(res => res)
      .catch(() => [])
  },

}