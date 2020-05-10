const contentWrapper = document.querySelector('#content__contentWrapper')

const websitePath = window.location.pathname

let requestedMardown = undefined

const configfilePath = './assets/content/config.json'

// fetch Configfile

fetch(configfilePath)
  .then((res) => res.json())
  .then((config) => {
    requestedMardown = config.find((configuration) =>
      typeof configuration.websitePath === 'string'
        ? configuration.websitePath === websitePath
        : configuration.websitePath.find((path) => path === websitePath)
    ).markdownPath
    console.log(websitePath, requestedMardown)
  })
