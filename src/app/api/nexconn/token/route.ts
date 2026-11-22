import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface IssueTokenRequestBody {
  userId?: string;
  name?: string;
  avatarUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: IssueTokenRequestBody = await request.json().catch(() => ({}));

    const userId = body.userId || `user_${Math.floor(1000 + Math.random() * 9000)}`;
    const name = body.name || `User ${userId}`;
    const avatarUrl = body.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${userId}`;

    const appKey = process.env.NEXCONN_APP_KEY || process.env.NEXT_PUBLIC_NEXCONN_APP_KEY;
    const appSecret = process.env.NEXCONN_APP_SECRET;
    const baseUrl = process.env.NEXCONN_BASE_URL || 'https://api.sg-light-api.com';

    // If appKey and appSecret are not configured, return an informative demo token
    // This allows seamless local evaluation and demo testing without crashing
    if (!appKey || !appSecret || appKey === 'YOUR_APP_KEY' || appSecret === 'YOUR_APP_SECRET') {
      return NextResponse.json({
        code: 0,
        result: {
          userId,
          accessToken: `demo_token_${userId}_${Date.now()}`,
        },
        mode: 'demo',
        message: 'Running in demo mode. Add NEXCONN_APP_KEY and NEXCONN_APP_SECRET in .env.local for live server issuance.',
      });
    }

    // Official Nexconn Server API SHA1 Signature Generation:
    // SHA1(AppSecret + Nonce + Timestamp)
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const timestamp = Date.now().toString();
    const signatureRaw = `${appSecret}${nonce}${timestamp}`;
    const signature = crypto.createHash('sha1').update(signatureRaw).digest('hex');

    const issueUrl = `${baseUrl.replace(/\/$/, '')}/v4/auth/access-token/issue`;

    const nexconnResponse = await fetch(issueUrl, {
      method: 'POST',
      headers: {
        'App-Key': appKey,
        'Nonce': nonce,
        'Timestamp': timestamp,
        'Signature': signature,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        name,
        avatarUrl,
      }),
    });

    const data = await nexconnResponse.json();

    if (!nexconnResponse.ok || data.code !== 0) {
      console.warn('Nexconn server API response:', data);
      return NextResponse.json(
        {
          code: data.code || nexconnResponse.status,
          error: data.msg || 'Failed to issue Nexconn access token from server',
          fallbackToken: `demo_fallback_${userId}`,
        },
        { status: nexconnResponse.status === 200 ? 400 : nexconnResponse.status }
      );
    }

    return NextResponse.json({
      code: 0,
      result: data.result,
      mode: 'live',
    });
  } catch (error: any) {
    console.error('Error issuing Nexconn token:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
