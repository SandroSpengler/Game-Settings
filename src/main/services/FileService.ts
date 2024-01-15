import { dialog } from 'electron'
import fs from 'fs'

export const importFile = async (): Promise<string> => {
  const dialogResult = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: 'json',
        extensions: ['json']
      }
    ]
  })

  const fileContent = fs.readFileSync(dialogResult.filePaths[0], 'utf-8')

  return fileContent
}
