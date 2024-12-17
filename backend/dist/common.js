"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObject = exports.mongooseModelQueryObjectForDateRange = exports.paginatingUrl = exports.isCurrentMinuteStartOfHour = exports.isTodayFirstDayOfTheYear = exports.isCurrentHourWithinStartOfTheDay = exports.didMonthStartedToday = exports.mongooseModelQueryObjectForTodayDoc = exports.mongooseModelQueryObjectForExpirationDateFromToday = exports.mongooseModelQueryObjectForPassDateByDays = exports.getCutoffDateBySpecifiedDays = exports.getRemainingDays = exports.getDateWithBaseHour = exports.getDateByAddedDaysToDate = exports.hasDatePassedSpecifiedDays = exports.getDaysDifference = exports.shallowRemoveDuplicates = void 0;
exports.sanitizeHTML = sanitizeHTML;
exports.getUser = getUser;
exports.getCurrentUrlWithoutQueryParams = getCurrentUrlWithoutQueryParams;
exports.getRequestUrl = getRequestUrl;
exports.splitStringIntoChunks = splitStringIntoChunks;
exports.getDefinedValuesFrom = getDefinedValuesFrom;
exports.escapeRegExp = escapeRegExp;
exports.decodeQuery = decodeQuery;
exports.encodeQuery = encodeQuery;
exports.sumField = sumField;
exports.getObjectField = getObjectField;
exports.getDayRegex = getDayRegex;
exports.getDayString = getDayString;
exports.createIndexHtmlRecursively = createIndexHtmlRecursively;
exports.findFilesRecursively = findFilesRecursively;
exports.findFileRecursively = findFileRecursively;
exports.formatDateForFilename = formatDateForFilename;
exports.isToday = isToday;
exports.calculateReadingTimeInMinute = calculateReadingTimeInMinute;
const constants_1 = require("./configs/constants");
const dompurify_1 = __importDefault(require("dompurify"));
const jsdom_1 = require("jsdom");
const SharedConfig_1 = __importDefault(require("./libs/SharedConfig"));
const path_1 = __importStar(require("path"));
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const window = new jsdom_1.JSDOM('').window;
const DOMPurify = (0, dompurify_1.default)(window);
function sanitizeHTML(html) {
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
    };
    // Use DOMPurify to sanitize the HTML
    const sanitizedHTML = DOMPurify.sanitize(html, config);
    return sanitizedHTML;
}
function getUser(req) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = req.user;
    return user;
}
function getCurrentUrlWithoutQueryParams(req) {
    const url = (req?.baseUrl || '') + (req?.url || '');
    return url.split('?')[0] || url || '';
}
function getRequestUrl(req) {
    req = req || SharedConfig_1.default.get('req');
    const url = `${req?.protocol}://${req?.headers['x-forwarded-server'] || req?.hostname}${req?.originalUrl}`;
    return url;
}
function splitStringIntoChunks(str, chunkSize) {
    const chunks = [];
    let i = 0;
    while (i < str.length) {
        chunks.push(str.slice(i, i + chunkSize));
        i += chunkSize;
    }
    return chunks;
}
function getDefinedValuesFrom(object) {
    const definedValues = {};
    for (const key in object) {
        const value = object[key];
        if (value != null && value != undefined) {
            definedValues[key] = value;
        }
    }
    return definedValues;
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function decodeQuery(query) {
    const decodedData = Buffer.from(`${query}`, 'base64').toString('utf-8');
    return JSON.parse(decodedData);
}
function encodeQuery(query) {
    const toStr = JSON.stringify(query);
    const encoded = Buffer.from(toStr).toString('base64');
    return encoded;
}
function sumField(objArr, ...field) {
    if (!objArr || (Array.isArray(objArr) && objArr.length <= 0)) {
        return 0;
    }
    let sum = 0;
    for (const obj of objArr) {
        let theValue = getObjectField(obj, field);
        if (theValue) {
            if (typeof theValue === 'string') {
                theValue = parseInt(theValue);
            }
            if (typeof theValue === 'number') {
                sum += theValue;
            }
        }
    }
    return sum;
}
function getObjectField(obj, fields) {
    const f = [...fields];
    if (f.length <= 0 || !obj) {
        return obj;
    }
    const leftMostFieldName = f.shift();
    if (!leftMostFieldName) {
        return obj;
    }
    return getObjectField(obj[leftMostFieldName], f);
}
function getDayRegex(dateOrDateString) {
    let date;
    if (dateOrDateString instanceof Date) {
        date = dateOrDateString;
    }
    else if (typeof dateOrDateString === 'string') {
        if (dateOrDateString == 'today') {
            date = new Date();
        }
        else if (dateOrDateString == 'tomorrow') {
            const today = new Date();
            today.setDate(today.getDate() + 1);
            date = today;
        }
        else {
            date = new Date(dateOrDateString);
        }
    }
    else {
        date = new Date();
    }
    /* const dayRegex = `^(${date.getDate()})[-./](0?${
      date.getMonth() + 1
      })[-./](${date.getFullYear()})$`; */
    const dayRegex = `^(${date.getMonth() + 1})[-./](0?${date.getDate()})[-./](${date.getFullYear()})$`;
    return dayRegex;
}
function getDayString(dateOrDateString) {
    let date;
    if (dateOrDateString instanceof Date) {
        date = dateOrDateString;
    }
    else if (typeof dateOrDateString === 'string') {
        if (dateOrDateString == 'today') {
            date = new Date();
        }
        else if (dateOrDateString == 'tomorrow') {
            const today = new Date();
            today.setDate(today.getDate() + 1);
            date = today;
        }
        else {
            date = new Date(dateOrDateString);
        }
    }
    else {
        date = new Date();
    }
    /* const dayRegex = `^(${date.getDate()})[-./](0?${
      date.getMonth() + 1
      })[-./](${date.getFullYear()})$`; */
    const dayString = `${date.getMonth() + 1}/${`${date.getDate()}`.length < 2 ? `0` : ''}${date.getDate()}/${date.getFullYear()}`;
    return dayString;
}
const shallowRemoveDuplicates = (arr) => {
    const unique = new Set();
    const filtered = arr?.filter((item) => {
        if (item && !unique.has(item)) {
            unique.add(item);
            return true;
        }
        return false;
    });
    return filtered;
};
exports.shallowRemoveDuplicates = shallowRemoveDuplicates;
const getDaysDifference = (firstDate, secondDate) => {
    // eslint-disable-next-line no-empty
    if (firstDate instanceof Date) {
    }
    else {
        firstDate = new Date(firstDate);
    }
    if (secondDate instanceof Date) {
        /* empty */
    }
    else {
        secondDate = new Date(secondDate);
    }
    const diffInMillis = Math.abs(firstDate.getTime() - secondDate.getTime());
    //conver the time difference in millis to days
    const diffInDays = Math.floor(diffInMillis / constants_1.DAY);
    return diffInDays;
};
exports.getDaysDifference = getDaysDifference;
const hasDatePassedSpecifiedDays = (targetDate, days) => {
    const currentDate = new Date();
    if (targetDate instanceof Date) {
        /* empty */
    }
    else {
        targetDate = new Date(targetDate);
    }
    const targetTime = targetDate.getTime() + days * constants_1.DAY;
    const targetDateTime = new Date(targetTime);
    return targetDateTime <= currentDate;
};
exports.hasDatePassedSpecifiedDays = hasDatePassedSpecifiedDays;
const getDateByAddedDaysToDate = (days, targetDate) => {
    if (!targetDate) {
        targetDate = new Date();
    }
    else if (targetDate instanceof Date) {
        /* empty */
    }
    else {
        targetDate = new Date(targetDate);
    }
    const targetTime = targetDate.getTime() + days * constants_1.DAY;
    const targetDateTime = new Date(targetTime);
    return targetDateTime;
};
exports.getDateByAddedDaysToDate = getDateByAddedDaysToDate;
const getDateWithBaseHour = (baseHour, targetDate) => {
    if (!targetDate) {
        targetDate = new Date();
    }
    else {
        targetDate = new Date(targetDate);
    }
    targetDate.setHours(baseHour, 0, 0, 0);
    return targetDate;
};
exports.getDateWithBaseHour = getDateWithBaseHour;
const getRemainingDays = (previousDate) => {
    const currentDate = new Date();
    if (!(previousDate instanceof Date)) {
        previousDate = new Date(previousDate);
    }
    const diffInMillis = previousDate.getTime() - currentDate.getTime();
    if (diffInMillis <= 0) {
        return 0;
    }
    //convert the time difference in millis to days
    const remainingDays = Math.ceil(diffInMillis / constants_1.DAY);
    return remainingDays;
};
exports.getRemainingDays = getRemainingDays;
const getCutoffDateBySpecifiedDays = (days) => {
    /* const cutoffDate = new Date();
    const cutoffDateT = new Date();
    cutoffDateT.setDate(cutoffDate.getDate() - days);
    return cutoffDateT; */
    const currentDate = new Date();
    const targetDate = new Date(currentDate.getTime() - days * constants_1.DAY);
    return targetDate;
};
exports.getCutoffDateBySpecifiedDays = getCutoffDateBySpecifiedDays;
const mongooseModelQueryObjectForPassDateByDays = (days, path) => {
    const cutoffDate = (0, exports.getCutoffDateBySpecifiedDays)(days);
    const query = { [path]: { $gte: cutoffDate } };
    return query;
};
exports.mongooseModelQueryObjectForPassDateByDays = mongooseModelQueryObjectForPassDateByDays;
const mongooseModelQueryObjectForExpirationDateFromToday = (path) => {
    const expirationDate = new Date();
    const query = { [path]: { $lte: expirationDate } };
    return query;
};
exports.mongooseModelQueryObjectForExpirationDateFromToday = mongooseModelQueryObjectForExpirationDateFromToday;
const mongooseModelQueryObjectForTodayDoc = (path) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set the time to the beginning of the next day
    const query = {
        [path]: {
            $gte: today, // Greater than or equal to today's date
            $lt: tomorrow, // Less than tomorrow's date
        },
    };
    return query;
};
exports.mongooseModelQueryObjectForTodayDoc = mongooseModelQueryObjectForTodayDoc;
const didMonthStartedToday = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return today.getTime() === startOfMonth.getTime();
};
exports.didMonthStartedToday = didMonthStartedToday;
const isCurrentHourWithinStartOfTheDay = () => {
    const currentHour = new Date().getHours();
    return currentHour === 0;
};
exports.isCurrentHourWithinStartOfTheDay = isCurrentHourWithinStartOfTheDay;
const isTodayFirstDayOfTheYear = () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    return day === 1 && month === 0; // January is represented as month 0
};
exports.isTodayFirstDayOfTheYear = isTodayFirstDayOfTheYear;
const isCurrentMinuteStartOfHour = () => {
    const currentMinute = new Date().getMinutes();
    return currentMinute === 0;
};
exports.isCurrentMinuteStartOfHour = isCurrentMinuteStartOfHour;
async function createIndexHtmlRecursively(directory) {
    const files = await (0, promises_1.readdir)(directory);
    for (const file of files) {
        const filePath = path_1.default.join(directory, file);
        const stats = await (0, promises_1.stat)(filePath);
        if (`${file}`.startsWith('.')) {
            continue;
        }
        if (stats.isDirectory()) {
            await createIndexHtmlRecursively(filePath);
        }
        else if (file === 'index.html') {
            continue;
        }
    }
    const indexPath = path_1.default.join(directory, 'index.html');
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
    `;
    if (!(0, fs_1.existsSync)(indexPath)) {
        await (0, promises_1.writeFile)(indexPath, htmlContent);
    }
}
async function findFilesRecursively(directory, container = [], include = []) {
    const files = await (0, promises_1.readdir)(directory);
    for (const file of files) {
        const filePath = (0, path_1.join)(directory, file);
        const stats = await (0, promises_1.stat)(filePath);
        if (`${file}`.startsWith('.')) {
            continue;
        }
        if (stats.isDirectory()) {
            return await findFilesRecursively(filePath, container, include);
        }
        else {
            const included = include.some((str) => file.endsWith(str) || file.startsWith(str));
            if (include.length > 0 && !included) {
                continue;
            }
            container.push(filePath);
        }
    }
    return container;
}
async function findFileRecursively(directory, fileName) {
    const files = await (0, promises_1.readdir)(directory);
    for (const file of files) {
        const filePath = (0, path_1.join)(directory, file);
        const stats = await (0, promises_1.stat)(filePath);
        if (`${file}`.startsWith('.')) {
            continue;
        }
        if (stats.isDirectory()) {
            return await findFileRecursively(filePath, fileName);
        }
        else {
            const found = file == fileName;
            if (!found) {
                continue;
            }
            return filePath;
        }
    }
    return '';
}
const paginatingUrl = (url, data, size = 10) => {
    const dataString = encodeQuery(data);
    return `${url}?q=${dataString}&size=${size}`;
};
exports.paginatingUrl = paginatingUrl;
function formatDateForFilename(date) {
    date = date ? new Date(date) : new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}
const mongooseModelQueryObjectForDateRange = (path = 'createdAt.date', dateRange = 'thismonth') => {
    let high = new Date();
    let low = new Date();
    switch (dateRange) {
        case 'lastweek':
            {
                const today = new Date();
                const todayWeekDay = today.getDay();
                const todayDate = today.getDate();
                const weekEnd = new Date();
                weekEnd.setDate(todayDate - (todayWeekDay + 1));
                const weekStart = new Date();
                weekStart.setDate(weekEnd.getDate() - todayWeekDay);
                high = weekEnd;
                low = weekStart;
            }
            break;
        case 'lastmonth':
            {
                const monthEnd = new Date();
                monthEnd.setDate(0);
                const monthStart = new Date();
                monthStart.setDate(0);
                monthStart.setDate(1);
                high = monthEnd;
                low = monthStart;
            }
            break;
        case 'thismonth':
            {
                const monthEnd = new Date();
                monthEnd.setDate(31);
                const monthStart = new Date();
                monthStart.setDate(1);
                high = monthEnd;
                low = monthStart;
            }
            break;
        case 'yesterday':
            {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                low = yesterday;
            }
            break;
        case 'today':
        default:
            //Don't bother today's date is already set as high and low
            break;
    }
    //End of the day
    high.setHours(23, 59, 59, 59);
    //Start of the day
    low.setHours(0, 0, 0, 0);
    const query = { [path]: { $lte: high, $gte: low } };
    return query;
};
exports.mongooseModelQueryObjectForDateRange = mongooseModelQueryObjectForDateRange;
function isToday(dayString) {
    const today = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = today.getDay(); // getDay() returns 0 for Sunday, 1 for Monday, etc.
    return daysOfWeek[dayOfWeek].toLowerCase() === dayString.toLowerCase();
}
const getObject = (scm) => {
    const obj = {};
    scm.clone().eachPath((path, type) => {
        const opt = {
            required: type.isRequired,
            type: type.instance,
            default: type.defaultOptions,
            option: type.options,
        };
        if (path === 'createdAt' || path === 'updatedAt') {
            opt.option = {
                object: {
                    timeString: 'String',
                    dateString: 'String',
                    time: 'Number',
                    date: 'Date',
                },
            };
        }
        else {
            opt.option.type.childSchemas && (opt.option.type.childSchemas = {});
            opt.option.type.tree && (opt.option.type.tree = {});
            opt.option.type.plugins && (opt.option.type.plugins = {});
            opt.option.type.virtuals && (opt.option.type.virtuals = {});
        }
        obj[path] = opt;
    });
    return obj;
};
exports.getObject = getObject;
function calculateReadingTimeInMinute(htmlContent) {
    const text = new jsdom_1.JSDOM(htmlContent).window.document.body.textContent || '';
    const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;
    const wordsPerMinute = 200;
    const readingTimeInMinutes = Math.ceil(wordCount / wordsPerMinute);
    return readingTimeInMinutes;
}
