export type Process = {
  pid: number
  ppid?: number | undefined
  uid?: number | undefined
  gid?: number | undefined
  name?: string
  cmd: string[]
  bin?: string
}
