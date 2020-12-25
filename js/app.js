import Keyboard from "./keyboard.js"
import KeySetTable from "./keySetTable.js"

class App {
  constructor() {
    /** 결과출력 element */
    this.result = document.querySelector(".key-result")
    /** 저장버튼 */
    this.btnSave = document.querySelector("#btn_save")
    this.category = document.querySelector("#category")
    this.name = document.querySelector("#name")
    this.keys = document.querySelector("#keys")
  }
  setEventListeners() {
    this.btnSave.addEventListener("click", (event) => {
      this.keySetTable.save({
        keys: this.keyboard.snapshotKeyDown,
        category: this.category.value,
        name: this.name.value,
      })
    })
    document.addEventListener("keyboard-pressed", (event) => {
      this.result.innerHTML = event.detail.text()
      this.keys.value = event.detail.text()
    })
  }
  init() {
    this.keyboard = new Keyboard({ selector: ".keyboard" })
    this.keyboard.init()
    this.keySetTable = new KeySetTable({ selector: "#keyset" })
    this.keySetTable.init()
    this.keySetTable.show()
    this.setEventListeners()
  }
}

const app = new App()
app.init()

//강제 이벤트 발생
// document.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }))
