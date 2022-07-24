export function asTime(epoch: string) {
  return new Date(epoch).toLocaleTimeString('en-GB')
}
