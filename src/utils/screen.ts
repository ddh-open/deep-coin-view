export const fullScreen = (id: string) => {
  const element = document.getElementById(id)
  // @ts-ignore
  const requestMethod =
    // W3C
    // @ts-ignore
    element.requestFullScreen ||
    // FireFox
    // @ts-ignore
    element.webkitRequestFullScreen ||
    // Chrome
    // @ts-ignore
    element.mozRequestFullScreen ||
    // IE11
    // @ts-ignore
    element.msRequestFullScreen
  if (requestMethod) {
    requestMethod.call(element)
  }
}
