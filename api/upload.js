import { handleUpload } from '@vercel/blob/client';
import { PATH_RE, CATS } from './_lib.js';

// 浏览器直传图片到 Vercel Blob：这里只负责校验路径并发放上传凭证
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch (e) { return Response.json({ error: 'bad_json' }, { status: 400 }); }
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const m = pathname.match(PATH_RE);
        if (!m || !CATS.includes(m[1])) throw new Error('Invalid pathname');
        return {
          allowedContentTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
          maximumSizeInBytes: 20 * 1024 * 1024,
          addRandomSuffix: false
        };
      }
    });
    return Response.json(result);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 });
  }
}
