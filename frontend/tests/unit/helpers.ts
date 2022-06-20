import { JSDOM } from 'jsdom'

export class HtmlAssertHelper {
  dom: JSDOM

  public constructor(html: string) {
    this.dom = new JSDOM(html)
  }

  public containsTextValue(selector: string, expectedValue: string): boolean {
    const value = this.dom.window.document.querySelector(selector)?.textContent?.trim()
    return value === undefined ? false : value.includes(expectedValue)
  }

  public selectorExists(selector: string): boolean {
    return this.dom.window.document.querySelector(selector) !== null
  }
}
