import KEY_TABLE from "../data/KeyTable.js"

export default class Keyboard {
  constructor({ selector }) {
    /** 키 정보 Table */
    this.keyTable = Array.from(KEY_TABLE)
    /** 키보드 element */
    this.keyboard = document.querySelector(selector)
    /** 입력 Key (동시 입력) */
    this.activeKeyDownSet = new Set()
    /** 최근 입력 Key 백업 (입력 Key Snapshot 버전) */
    this.snapshotKeyDown = []
  }
  /** order 로 순서정렬 */
  sortByOrder(prev, curr) {
    return prev.order - curr.order
  }
  /** 라인에 맞추어 엘리먼트 추가 */
  appendKeyLine(lineNo) {
    const line = document.createElement("li")
    line.classList.add("line")
    line.setAttribute("data-line", lineNo)
    this.keyTable
      .filter((key) => key.line == lineNo)
      .sort(this.sortByOrder)
      .map((key) => {
        const el = document.createElement("button")
        el.classList.add("key")
        el.setAttribute("data-key", key.key)
        el.setAttribute("data-code", key.code)
        el.innerHTML = key.name
        let growVal = 0
        switch (key.code) {
          case "CapsLock":
          case "Enter":
          case "ShiftLeft":
          case "ShiftRight":
          case "Tab":
          case "Backslash":
          case "Backspace":
          case "Space":
            growVal = 1
            break
        }
        el.style["flex-grow"] = growVal
        return (key.el = el)
      })
      .forEach((el) => line.appendChild(el))
    return line
  }
  setEventListeners() {
    document.addEventListener("keydown", (event) => {
      // event.preventDefault()
      const found = this.keyTable.find((key) => key.code === event.code)
      this.activeKeyDownSet.add(found.name)
      this.snapshotKeyDown = Array.from(this.activeKeyDownSet)
      found.el.classList.add("backlight")
      window.setTimeout(() => found.el.classList.remove("backlight"), 500)

      //
      //이벤트 전파
      //
      const pressedKey = this.snapshotKeyDown.reduce((prev, curr) => `${prev}+${curr}`)
      document.dispatchEvent(
        new CustomEvent("keyboard-pressed", { detail: { text: () => pressedKey } })
      )
    })
    document.addEventListener("keyup", (event) => {
      // event.preventDefault()
      const found = this.keyTable.find((key) => key.code === event.code)
      this.activeKeyDownSet.delete(found.name)
    })
  }
  init() {
    this.setEventListeners()
    this.keyboard.appendChild(this.appendKeyLine(2))
    this.keyboard.appendChild(this.appendKeyLine(3))
    this.keyboard.appendChild(this.appendKeyLine(4))
    this.keyboard.appendChild(this.appendKeyLine(5))
    this.keyboard.appendChild(this.appendKeyLine(6))
  }
}
