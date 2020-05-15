interface IConfiguration extends Object {
  path?: String | String[]
  name?: String
  dedicatedPath: RequestInfo
  audio?: string
}

export default class SSR {
  private wrapper: HTMLElement | null = null
  private configFilePath: String
  private configuration: IConfiguration[] | null
  private SSRLinks: NodeListOf<HTMLAnchorElement>
  private name: string | null
  private path: string | null
  private audioElement: HTMLAudioElement | null
  constructor(configFilePath: string) {
    this.wrapper = document.querySelector('#SSR__contentWrapper')
    this.configFilePath = configFilePath
    this.configuration = null
    this.SSRLinks = document.querySelectorAll('[data-SSR-link]')
    this.name = this.getLinkedSSRName(window.location.href)
    this.path = window.location.pathname + window.location.search
    this.audioElement = document.querySelector('audio[data-SSR-audio]')
    this.printContent()
    if (this.SSRLinks.length !== 0) this.listenOnLinks()
  }

  getLinkedSSRName(url: string): string | null {
    return new URL(url).searchParams.get('SSR')
  }
  private async setConfigutation() {
    if (!this.configFilePath || typeof this.configFilePath !== 'string')
      return console.error(
        '[SSR]: No valid reference to the configuration file'
      )
    this.configuration = await (await fetch(this.configFilePath)).json()
  }

  private async printContent() {
    // load configuration if this isn't already done
    if (!this.configuration) await this.setConfigutation()
    // search dedicated path
    const match = this.configuration!.find(
      (config) =>
        config.path?.includes(this.path!) ||
        config.name?.toLocaleLowerCase() === this.name
    )
    if (!match)
      return console.error(
        `[SSR]: Couldn't find any configuration'.
         Please check the configuration file '${this.configFilePath}' and the given paths.`
      )
    // fetch dedicated file
    let file: string = await (await fetch(match.dedicatedPath)).text()

    // convert dedicated file if necessary
    if (/.*.md$/.test(match.dedicatedPath.toString()))
      // @ts-ignore
      file = window.markdownit().render(file)
    // display content
    this.wrapper!.innerHTML = file
    // play audio
    this.audioElement!.src = match.audio!
    this.audioElement?.play()
    if (match)
      // update link
      this.updateLinks()
  }
  private updateLinks() {
    console.log(this.path)
    this.SSRLinks?.forEach((link) => {
      if (
        this.name === this.getLinkedSSRName(link.href) ||
        this.path === link.pathname + link.search
      ) {
        // if link is called, add given class
        link.classList.add(link.getAttribute('data-SSR-link')!)
      } else {
        link.classList.remove(link.getAttribute('data-SSR-link')!)
      }
    })
  }

  private listenOnLinks() {
    this.SSRLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        // prevent site switch
        e.preventDefault()
        this.path = link.pathname + link.search
        this.name = this.getLinkedSSRName(link.href)
        this.printContent()
      })
    })
  }
}
