const fs = require('fs')
const path = require('path')
const readline = require('readline')

function processFile(fileName) {
  const file = path.resolve(fileName)
  const lineReader = readline.createInterface({
    input: fs.createReadStream(file)
  })

  let outputFile = undefined
  let outputStream = undefined

  let diff = undefined
  let dropped = 0
  let lines = 0

  lineReader.on('line', (line) => {
    if ((line || '').indexOf('$GPRMC') > 0) {
      const splitted = line.split(',')
      const time = splitted[1]
      const date = splitted[9]
      const parsedDate = new Date(Date.UTC(`20`+date.substring(4), parseInt(date.substring(2,4))-1, date.substring(0, 2), time.substring(0, 2), time.substring(2, 4), time.substring(4, 6), time.substring(7)))
      const s = parseInt(line.split(';')[0])
      if (!outputFile) {
        outputFile = path.resolve(`fixed-${parsedDate.toISOString().split('.')[0]}.log`)
        outputStream = fs.createWriteStream(outputFile)
      }
      diff = parsedDate.valueOf() - s
    }

    if (diff !== undefined) {
      const oldTime = parseInt(line.split(';')[0])
      const newTime = oldTime + diff
      const newLine = '' + newTime + line.substring(13) + '\n'
      outputStream.write(newLine)
      lines += 1
    } else {
      dropped += 1
    }
  })

  lineReader.on('close', () => {
    if (outputFile) {
      console.log(`File ${outputFile} written with ${lines} lines, dropped ${dropped} lines`)
    } else {
      console.log(`Skipped file ${file} with ${dropped} lines, no $GPRMC sentences`)
    }
  })
}

process.argv.slice(2).forEach(processFile)
