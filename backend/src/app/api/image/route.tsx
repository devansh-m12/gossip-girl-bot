import puppeteer from 'puppeteer'
import { NextResponse } from 'next/server'

// Change to Node.js runtime
export const runtime = 'nodejs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const text = searchParams.get("text") || "hey!!!"
    const retweets = searchParams.get("retweets") || "200"
    const quotes = searchParams.get("quotes") || "4K"
    const likes = searchParams.get("likes") || "20K"
    const timestamp = searchParams.get("timestamp") || "6:17 PM · Feb 5, 2023"
    const client = searchParams.get("client") || "Twitter for LG Smart Fridge"

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    try {
      const page = await browser.newPage()
      
      // Set viewport to match desired image dimensions
      await page.setViewport({ width: 755, height: 345 })

      // HTML content
      const html = `
        <html>
          <head>
            <style>
              body {
                margin: 0;
                font-family: system-ui, -apple-system, sans-serif;
              }
              .container {
                height: 100%;
                width: 100%;
                display: flex;
                flex-direction: column;
                background-color: #000000;
                padding: 20px;
                box-sizing: border-box;
              }
              .header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 12px;
              }
              .avatar {
                width: 48px;
                height: 48px;
                border-radius: 24px;
              }
              .user-info {
                display: flex;
                flex-direction: column;
              }
              .name-container {
                display: flex;
                align-items: center;
                gap: 4px;
              }
              .name {
                color: #ffffff;
                font-size: 16px;
                font-weight: bold;
              }
              .handle {
                color: #71767B;
                font-size: 14px;
              }
              .content {
                color: #ffffff;
                font-size: 24px;
                margin-bottom: 12px;
              }
              .meta {
                color: #71767B;
                font-size: 14px;
                margin-bottom: 16px;
              }
              .metrics {
                display: flex;
                gap: 24px;
                color: #71767B;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img class="avatar" src="https://ui-avatars.com/api/?name=S&background=random" />
                <div class="user-info">
                  <div class="name-container">
                    <span class="name">suki</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M16 8A8 8 0 110 8a8 8 0 0116 0z" fill="#1D9BF0" />
                      <path d="M7.002 11.233l-2.295-2.295-1.414 1.414 3.709 3.709 7.071-7.071-1.414-1.414-5.657 5.657z" fill="#fff" />
                    </svg>
                  </div>
                  <span class="handle">@sukislover</span>
                </div>
              </div>
              <div class="content">${text}</div>
              <div class="meta">${timestamp} · ${client}</div>
              <div class="metrics">
                <span>${retweets} Retweets</span>
                <span>${quotes} Quote Tweets</span>
                <span>${likes} Likes</span>
              </div>
            </div>
          </body>
        </html>
      `

      await page.setContent(html)

      // Take screenshot
      const screenshot = await page.screenshot({
        type: 'png'
      })

      return new NextResponse(screenshot, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      })
    } finally {
      await browser.close()
    }
  } catch (e: any) {
    console.error(e)
    return NextResponse.json(
      { error: `Failed to generate the image: ${e.message}` },
      { status: 500 }
    )
  }
}

