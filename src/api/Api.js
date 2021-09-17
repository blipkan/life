export const Api = {
  Lang: {
    getMessages: lang =>
      import(`../../src/messages/${lang}.json`).then(
        response => response.default
      )
  }
}
