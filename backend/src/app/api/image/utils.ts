import { ImageResponse } from '@vercel/og';
import React from 'react';

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
  try {
    const imageResponse = new ImageResponse(
      React.createElement('div', {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000000',
          padding: '20px',
          fontFamily: 'system-ui'
        }
      }, [
        React.createElement('div', {
          key: 'header',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }
        }, [
          React.createElement('img', {
            key: 'avatar',
            src: 'https://ui-avatars.com/api/?name=GG&background=random',
            style: {
              width: '48px',
              height: '48px',
              borderRadius: '24px'
            }
          }),
          React.createElement('div', {
            key: 'user-info',
            style: {
              display: 'flex',
              flexDirection: 'column'
            }
          }, [
            React.createElement('div', {
              key: 'name-container',
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }
            }, [
              React.createElement('span', {
                key: 'name',
                style: {
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }
              }, 'Gossip Girl'),
              React.createElement('svg', {
                key: 'verified',
                width: 16,
                height: 16,
                viewBox: '0 0 16 16',
                style: { fill: '#1D9BF0' }
              }, [
                React.createElement('path', {
                  key: 'bg',
                  d: 'M16 8A8 8 0 110 8a8 8 0 0116 0z'
                }),
                React.createElement('path', {
                  key: 'check',
                  d: 'M7.002 11.233l-2.295-2.295-1.414 1.414 3.709 3.709 7.071-7.071-1.414-1.414-5.657 5.657z',
                  fill: '#fff'
                })
              ])
            ]),
            React.createElement('span', {
              key: 'handle',
              style: {
                color: '#71767B',
                fontSize: '14px'
              }
            }, '@gossipgirl')
          ])
        ]),
        React.createElement('div', {
          key: 'content',
          style: {
            color: '#ffffff',
            fontSize: '24px',
            marginBottom: '12px'
          }
        }, text),
        React.createElement('div', {
          key: 'meta',
          style: {
            color: '#71767B',
            fontSize: '14px',
            marginBottom: '16px'
          }
        }, `${timestamp} · ${client}`),
        React.createElement('div', {
          key: 'metrics',
          style: {
            display: 'flex',
            gap: '24px',
            color: '#71767B',
            fontSize: '14px'
          }
        }, [
          React.createElement('span', { key: 'retweets' }, `${retweets} Retweets`),
          React.createElement('span', { key: 'quotes' }, `${quotes} Quote Tweets`),
          React.createElement('span', { key: 'likes' }, `${likes} Likes`)
        ])
      ]),
      {
        width: 755,
        height: 345,
      }
    );

    // Convert the image response to a buffer
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadToPinata(buffer, {
      text,
      timestamp,
      client
    });

    return {
      ipfsHash: result.IpfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
    };
  } catch (error) {
    console.error('Error generating tweet image:', error);
    throw error;
  }
} 