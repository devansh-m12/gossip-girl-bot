import puppeteer from 'puppeteer';

interface TweetImageParams {
  text: string;
  timestamp?: string;
  client?: string;
  retweets?: string;
  quotes?: string;
  likes?: string;
}

async function uploadToPinata(imageBuffer: Buffer | Uint8Array, metadata: any) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const data = new FormData();
  
  // Add the file
  const blob = new Blob([Buffer.from(imageBuffer)], { type: 'image/png' });
  data.append('file', blob, 'tweet.png');
  
  // Add the metadata
  data.append('pinataMetadata', JSON.stringify({
    name: `Tweet-${Date.now()}`,
    keyvalues: metadata
  }));

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'pinata_api_key': process.env.PINATA_API_KEY || '',
      'pinata_secret_api_key': process.env.PINATA_SECRET_KEY || ''
    },
    body: data
  });

  if (!res.ok) {
    throw new Error(`Failed to upload to Pinata: ${await res.text()}`);
  }

  return await res.json();
}

export async function generateTweetImage({
  text = "hey!!!",
  retweets = "200",
  quotes = "4K",
  likes = "20K",
  timestamp = "6:17 PM · Feb 5, 2023",
  client = "Twitter for LG Smart Fridge"
}: TweetImageParams) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 755, height: 345 });

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
              <img class="avatar" src="https://ui-avatars.com/api/?name=GG&background=random" />
              <div class="user-info">
                <div class="name-container">
                  <span class="name">Gossip Girl</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M16 8A8 8 0 110 8a8 8 0 0116 0z" fill="#1D9BF0" />
                    <path d="M7.002 11.233l-2.295-2.295-1.414 1.414 3.709 3.709 7.071-7.071-1.414-1.414-5.657 5.657z" fill="#fff" />
                  </svg>
                </div>
                <span class="handle">@gossipgirl</span>
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
    `;

    await page.setContent(html);
    const screenshot = await page.screenshot({
      type: 'png'
    });

    const result = await uploadToPinata(screenshot, {
      text,
      timestamp,
      client
    });

    return {
      ipfsHash: result.IpfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    };
  } finally {
    await browser.close();
  }
} 