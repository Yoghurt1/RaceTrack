import { JSDOM } from 'jsdom'

export class HtmlAssertHelper {
  dom: JSDOM

  public constructor(html: string) {
    this.dom = new JSDOM(html)
  }
}
