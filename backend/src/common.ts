/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express'
import { DAY } from './configs/constants'

import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import SharedConfig from './libs/SharedConfig'
import path, { join } from 'path'
import { writeFile, readdir, stat } from 'fs/promises'
import IUser from './types/IUser'
import IAny from './types/IAny'
import { Schema } from 'mongoose'
import { existsSync } from 'fs'

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

export function sanitizeHTML(html: string): string {
  // Define a custom configuration to allow specific tags
  const config = {
    ALLOWED_TAGS: [
      'a',
      'abbr',
      'b',
      'blockquote',
      'br',
      'code',
      'div',
      'em',
      'h1',
      'h2',
      'h3',
      'i',
      'p',
      'span',
      'strong',
      'ul',
      'ol',
      'li',
      'table',
      'thead',
      'tbody',
      'tr',
      'td',
      'img',
    ],
  }

  // Use DOMPurify to sanitize the HTML
  const sanitizedHTML = DOMPurify.sanitize(html, config)

  return sanitizedHTML
}

export function getUser(req: Request): IUser | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: IUser = (req as any).user
  return user
}

export function getCurrentUrlWithoutQueryParams(req?: Request): string {
  const url = (req?.baseUrl || '') + (req?.url || '')
  return url.split('?')[0] || url || ''
}

export function getRequestUrl(req?: Request): string {
  req = req || SharedConfig.get('req')
  const url = `${req?.protocol}://${req?.headers['x-forwarded-server'] || req?.hostname}${req?.originalUrl}`
  return url
}

export function splitStringIntoChunks(str: string, chunkSize: number) {
  const chunks: string[] = []
  let i = 0
  while (i < str.length) {
    chunks.push(str.slice(i, i + chunkSize))
    i += chunkSize
  }
  return chunks
}

export function getDefinedValuesFrom(object: { [key: string]: any }) {
  const definedValues: { [key: string]: any } = {}
  for (const key in object) {
    const value = object[key]
    if (value != null && value != undefined) {
      definedValues[key] = value
    }
  }
  return definedValues
}

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function decodeQuery(query: string) {
  const decodedData = Buffer.from(`${query}`, 'base64').toString('utf-8')
  return JSON.parse(decodedData)
}

export function encodeQuery(query: { [key: string]: any }) {
  const toStr = JSON.stringify(query)
  const encoded = Buffer.from(toStr).toString('base64')
  return encoded
}

export function sumField(objArr: { [key: string]: any }[], ...field: string[]) {
  if (!objArr || (Array.isArray(objArr) && objArr.length <= 0)) {
    return 0
  }
  let sum = 0
  for (const obj of objArr) {
    let theValue = getObjectField(obj, field)
    if (theValue) {
      if (typeof theValue === 'string') {
        theValue = parseInt(theValue)
      }
      if (typeof theValue === 'number') {
        sum += theValue
      }
    }
  }
  return sum
}

export function getObjectField(obj: { [key: string]: any }, fields: string[]): any {
  const f = [...fields]
  if (f.length <= 0 || !obj) {
    return obj
  }
  const leftMostFieldName = f.shift()
  if (!leftMostFieldName) {
    return obj
  }
  return getObjectField(obj[leftMostFieldName], f)
}

export function getDayRegex(dateOrDateString?: string | Date) {
  let date: Date
  if (dateOrDateString instanceof Date) {
    date = dateOrDateString
  } else if (typeof dateOrDateString === 'string') {
    if (dateOrDateString == 'today') {
      date = new Date()
    } else if (dateOrDateString == 'tomorrow') {
      const today = new Date()
      today.setDate(today.getDate() + 1)
      date = today
    } else {
      date = new Date(dateOrDateString)
    }
  } else {
    date = new Date()
  }

  /* const dayRegex = `^(${date.getDate()})[-./](0?${
    date.getMonth() + 1
    })[-./](${date.getFullYear()})$`; */

  const dayRegex = `^(${date.getMonth() + 1})[-./](0?${date.getDate()})[-./](${date.getFullYear()})$`
  return dayRegex
}

export function getDayString(dateOrDateString?: string | Date) {
  let date: Date
  if (dateOrDateString instanceof Date) {
    date = dateOrDateString
  } else if (typeof dateOrDateString === 'string') {
    if (dateOrDateString == 'today') {
      date = new Date()
    } else if (dateOrDateString == 'tomorrow') {
      const today = new Date()
      today.setDate(today.getDate() + 1)
      date = today
    } else {
      date = new Date(dateOrDateString)
    }
  } else {
    date = new Date()
  }

  /* const dayRegex = `^(${date.getDate()})[-./](0?${
    date.getMonth() + 1
    })[-./](${date.getFullYear()})$`; */

  const dayString = `${date.getMonth() + 1}/${
    `${date.getDate()}`.length < 2 ? `0` : ''
  }${date.getDate()}/${date.getFullYear()}`
  return dayString
}

export const shallowRemoveDuplicates = (arr: any[]): any[] => {
  const unique = new Set()
  const filtered = arr?.filter((item) => {
    if (item && !unique.has(item)) {
      unique.add(item)
      return true
    }
    return false
  })
  return filtered
}

export const getDaysDifference = (firstDate: Date | string, secondDate: Date | string): number => {
  // eslint-disable-next-line no-empty
  if (firstDate instanceof Date) {
  } else {
    firstDate = new Date(firstDate)
  }

  if (secondDate instanceof Date) {
    /* empty */
  } else {
    secondDate = new Date(secondDate)
  }
  const diffInMillis = Math.abs(firstDate.getTime() - secondDate.getTime())
  //conver the time difference in millis to days
  const diffInDays = Math.floor(diffInMillis / DAY)
  return diffInDays
}

export const hasDatePassedSpecifiedDays = (targetDate: Date | string, days: number): boolean => {
  const currentDate = new Date()
  if (targetDate instanceof Date) {
    /* empty */
  } else {
    targetDate = new Date(targetDate)
  }
  const targetTime = targetDate.getTime() + days * DAY
  const targetDateTime = new Date(targetTime)

  return targetDateTime <= currentDate
}

export const getDateByAddedDaysToDate = (days: number, targetDate?: Date | string): Date => {
  if (!targetDate) {
    targetDate = new Date()
  } else if (targetDate instanceof Date) {
    /* empty */
  } else {
    targetDate = new Date(targetDate)
  }
  const targetTime = targetDate.getTime() + days * DAY
  const targetDateTime = new Date(targetTime)

  return targetDateTime
}

export const getDateWithBaseHour = (baseHour: number, targetDate?: Date | string) => {
  if (!targetDate) {
    targetDate = new Date()
  } else {
    targetDate = new Date(targetDate)
  }
  targetDate.setHours(baseHour, 0, 0, 0)
  return targetDate
}

export const getRemainingDays = (previousDate: Date | string): number => {
  const currentDate = new Date()
  if (!(previousDate instanceof Date)) {
    previousDate = new Date(previousDate)
  }
  const diffInMillis = previousDate.getTime() - currentDate.getTime()

  if (diffInMillis <= 0) {
    return 0
  }
  //convert the time difference in millis to days
  const remainingDays = Math.ceil(diffInMillis / DAY)
  return remainingDays
}

export const getCutoffDateBySpecifiedDays = (days: number) => {
  /* const cutoffDate = new Date();
  const cutoffDateT = new Date();
  cutoffDateT.setDate(cutoffDate.getDate() - days);
  return cutoffDateT; */
  const currentDate = new Date()
  const targetDate = new Date(currentDate.getTime() - days * DAY)
  return targetDate
}

export const mongooseModelQueryObjectForPassDateByDays = (days: number, path: string) => {
  const cutoffDate = getCutoffDateBySpecifiedDays(days)
  const query = { [path]: { $gte: cutoffDate } }
  return query
}

export const mongooseModelQueryObjectForExpirationDateFromToday = (path: string) => {
  const expirationDate = new Date()
  const query = { [path]: { $lte: expirationDate } }
  return query
}

export const mongooseModelQueryObjectForTodayDoc = (path: string) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set the time to the beginning of the day

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1) // Set the time to the beginning of the next day

  const query = {
    [path]: {
      $gte: today, // Greater than or equal to today's date
      $lt: tomorrow, // Less than tomorrow's date
    },
  }
  return query
}

export const didMonthStartedToday = () => {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  return today.getTime() === startOfMonth.getTime()
}

export const isCurrentHourWithinStartOfTheDay = () => {
  const currentHour = new Date().getHours()
  return currentHour === 0
}

export const isTodayFirstDayOfTheYear = () => {
  const currentDate = new Date()
  const day = currentDate.getDate()
  const month = currentDate.getMonth()
  return day === 1 && month === 0 // January is represented as month 0
}

export const isCurrentMinuteStartOfHour = () => {
  const currentMinute = new Date().getMinutes()
  return currentMinute === 0
}

export async function createIndexHtmlRecursively(directory: string): Promise<void> {
  const files = await readdir(directory)

  for (const file of files) {
    const filePath = path.join(directory, file)
    const stats = await stat(filePath)
    if (`${file}`.startsWith('.')) {
      continue
    }
    if (stats.isDirectory()) {
      await createIndexHtmlRecursively(filePath)
    } else if (file === 'index.html') {
      continue
    }
  }

  const indexPath = path.join(directory, 'index.html')
  const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 Not Found</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f1f1f1;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    text-align: center;
                }
                .container {
                    max-width: 600px;
                    padding: 20px;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>404 Not Found</h1>
                <p>The page you are looking for could not be found.</p>
            </div>
        </body>
        </html>
    `

  if (!existsSync(indexPath)) {
    await writeFile(indexPath, htmlContent)
  }
}

export async function findFilesRecursively(
  directory: string,
  container: string[] = [],
  include: string[] = [],
): Promise<string[]> {
  const files = await readdir(directory)

  for (const file of files) {
    const filePath = join(directory, file)
    const stats = await stat(filePath)
    if (`${file}`.startsWith('.')) {
      continue
    }
    if (stats.isDirectory()) {
      return await findFilesRecursively(filePath, container, include)
    } else {
      const included = include.some((str) => file.endsWith(str) || file.startsWith(str))
      if (include.length > 0 && !included) {
        continue
      }
      container.push(filePath)
    }
  }

  return container
}

export async function findFileRecursively(directory: string, fileName: string): Promise<string> {
  const files = await readdir(directory)

  for (const file of files) {
    const filePath = join(directory, file)
    const stats = await stat(filePath)
    if (`${file}`.startsWith('.')) {
      continue
    }
    if (stats.isDirectory()) {
      return await findFileRecursively(filePath, fileName)
    } else {
      const found = file == fileName
      if (!found) {
        continue
      }
      return filePath
    }
  }

  return ''
}

export const paginatingUrl = (url: string, data: IAny, size = 10) => {
  const dataString = encodeQuery(data)
  return `${url}?q=${dataString}&size=${size}`
}

export function formatDateForFilename(date?: string | Date) {
  date = date ? new Date(date) : new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}

export const mongooseModelQueryObjectForDateRange = (
  path = 'createdAt.date',
  dateRange: 'lastweek' | 'lastmonth' | 'thismonth' | 'yesterday' | 'today' = 'thismonth',
) => {
  let high = new Date()
  let low = new Date()

  switch (dateRange) {
    case 'lastweek':
      {
        const today = new Date()
        const todayWeekDay = today.getDay()
        const todayDate = today.getDate()
        const weekEnd = new Date()
        weekEnd.setDate(todayDate - (todayWeekDay + 1))
        const weekStart = new Date()
        weekStart.setDate(weekEnd.getDate() - todayWeekDay)
        high = weekEnd
        low = weekStart
      }
      break

    case 'lastmonth':
      {
        const monthEnd = new Date()
        monthEnd.setDate(0)
        const monthStart = new Date()
        monthStart.setDate(0)
        monthStart.setDate(1)
        high = monthEnd
        low = monthStart
      }
      break

    case 'thismonth':
      {
        const monthEnd = new Date()
        monthEnd.setDate(31)
        const monthStart = new Date()
        monthStart.setDate(1)
        high = monthEnd
        low = monthStart
      }
      break

    case 'yesterday':
      {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        low = yesterday
      }
      break

    case 'today':
    default:
      //Don't bother today's date is already set as high and low
      break
  }

  //End of the day
  high.setHours(23, 59, 59, 59)

  //Start of the day
  low.setHours(0, 0, 0, 0)

  const query = { [path]: { $lte: high, $gte: low } }
  return query
}

export function isToday(
  dayString: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday',
): boolean {
  const today = new Date()
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayOfWeek = today.getDay() // getDay() returns 0 for Sunday, 1 for Monday, etc.

  return daysOfWeek[dayOfWeek].toLowerCase() === dayString.toLowerCase()
}

export const getObject = (scm: Schema) => {
  const obj: { [key: string]: any } = {}
  scm.clone().eachPath((path, type) => {
    const opt = {
      required: type.isRequired,
      type: type.instance,
      default: type.defaultOptions,
      option: type.options,
    }
    if (path === 'createdAt' || path === 'updatedAt') {
      opt.option = {
        object: {
          timeString: 'String',
          dateString: 'String',
          time: 'Number',
          date: 'Date',
        },
      }
    } else {
      opt!.option!.type!.childSchemas && (opt!.option!.type!.childSchemas = {})
      opt!.option!.type!.tree && (opt!.option!.type!.tree = {})
      opt!.option!.type!.plugins && (opt!.option!.type!.plugins = {})
      opt!.option!.type!.virtuals && (opt!.option!.type!.virtuals = {})
    }

    obj[path] = opt
  })
  return obj
}

export function calculateReadingTimeInMinute(htmlContent: string): number {
  const text = new JSDOM(htmlContent).window.document.body.textContent || ''
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length
  const wordsPerMinute = 200
  const readingTimeInMinutes = Math.ceil(wordCount / wordsPerMinute)

  return readingTimeInMinutes
}
