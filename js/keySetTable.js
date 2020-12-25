export default class KeySetTable {
  constructor({ selector }) {
    /** 저장 element */
    this.el = document.querySelector(selector)
    const favKeysText = localStorage.getItem("favKeys") || JSON.stringify([])
    /** 저장소 (in.Memory) */
    this.store = JSON.parse(favKeysText)
  }
  show() {
    this.el.innerHTML = ""
    this.store.forEach((k) => {
      const tr = document.createElement("tr")
      const category = document.createElement("td")
      const name = document.createElement("td")
      const keys = document.createElement("td")
      const remove = document.createElement("td")
      category.innerHTML = k.category
      name.innerHTML = k.name
      keys.innerHTML = k.keys.map((k) => `<span class="key">${k}</span>`).join("+")
      remove.innerHTML = `<button class="key-remove" data-id="${k.id}">X</button>`
      tr.appendChild(category)
      tr.appendChild(name)
      tr.appendChild(keys)
      tr.appendChild(remove)
      this.el.appendChild(tr)
    })
  }
  save({ keys, category, name }) {
    const keySet = { keys, category, name }
    if (!this.isVaild(keySet)) return

    const id = this.createId(keySet)
    const already = this.store.find((k) => k.id === id)
    if (already) {
      this.remove(id)
    }
    this.store.push({ id, category, name, keys })
    this.updateLocalStorage()
    this.show()
  }
  remove(id) {
    const found = this.store.find((k) => k.id === id)
    if (!found) return
    this.store.splice(this.store.indexOf(found), 1)
    this.updateLocalStorage()
    this.show()
  }
  isVaild({ keys, category, name }) {
    return keys.length > 0 && name && category
  }
  createId({ keys, category, name }) {
    return `${category}|${name}|` + keys.reduce((p, c) => `${p}|${c}`)
  }
  updateLocalStorage() {
    localStorage.setItem("favKeys", JSON.stringify(this.store))
  }
  setEventListeners() {
    this.el.addEventListener("click", (event) => {
      const isRemoveBtn = event.target.classList.contains("key-remove")
      if (isRemoveBtn) {
        const id = event.target.dataset.id
        this.remove(id)
      }
    })
  }
  init() {
    this.setEventListeners()
  }
}
