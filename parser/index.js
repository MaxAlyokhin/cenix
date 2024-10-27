import puppeteer from 'puppeteer'
import UserAgent from 'user-agents'
import fs from 'fs'
import path from 'path'
const __dirname = path.resolve()

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function delay(timeMin, timeMax) {
    return new Promise((resolve) => {
        setTimeout(resolve, getRandom(timeMin, timeMax))
    })
}

async function vprokParse(url, region) {
    console.log('Запуск')
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--disable-notifications'],
    })
    const context = browser.defaultBrowserContext()
    const page = await context.newPage()

    await context.overridePermissions('https://www.vprok.ru/', ['notifications'])

    await page.setViewport({ width: 1920, height: 1080 })

    const userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString()
    await page.setUserAgent(userAgent)
    console.log(`Новый User Agent: ${userAgent}`)

    await page.goto(url, { waitUntil: 'load', timeout: 0 })

    console.log('Рандомная пауза')
    await delay(5000, 10000)

    await (await page.waitForSelector('[class^="Region_region"]')).evaluate((el) => el.click())

    const element = page.locator(`::-p-text(${region})`)
    element.click()

    const priceOld = await (await page.waitForSelector('[class^="PriceInfo_oldPrice"] span'))?.evaluate((el) => el.textContent)
    const price = await (await page.waitForSelector('[class^="PriceInfo_root"] > span'))?.evaluate((el) => el.textContent)
    const rating = await (await page.waitForSelector('[class^="Summary_reviewsContainer"] [class^="Summary_title"]'))?.evaluate((el) => el.textContent)
    const reviewCount = await (await page.waitForSelector('[class*="Summary_reviewsCountContainer"] [class^="Summary_title"]'))?.evaluate((el) => el.textContent)

    const result = `
        price=${price}
        priceOld=${priceOld}
        rating=${rating}
        reviewCount=${reviewCount}
    `

    console.log(result)

    fs.writeFileSync(`${__dirname}/product4.txt`, result)

    console.log('Делаем скрин')

    await page.waitForNavigation()
    await page.screenshot({ path: 'screenshot4.jpg', fullPage: true })

    await browser.close()
}

vprokParse(process.argv[2], process.argv[3])
