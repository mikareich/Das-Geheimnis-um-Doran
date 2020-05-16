export default class AudioService {
  private audioSRC: string[] | string
  private fadeIn: boolean

  constructor(audioSRC: string[] | string, fadeIn?: boolean) {
    this.audioSRC = audioSRC
    this.fadeIn = !fadeIn! || true
    console.log(this.fadeIn)
  }
}
