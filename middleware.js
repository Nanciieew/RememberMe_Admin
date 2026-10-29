// 整站密码保护：打开任何页面或接口前都需要输入用户名和密码（浏览器自带的登录框）。
// 用户名、密码在 Vercel 项目的环境变量 ADMIN_USER、ADMIN_PASSWORD 中设置。
import { next } from '@vercel/functions';

export const config = { matcher: '/:path*' };

export default function middleware(request) {
  const user = process.env.ADMIN_USER || 'admin';
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) {
    return new Response('ADMIN_PASSWORD is not set. Add it in Vercel → Settings → Environment Variables.', { status: 500 });
  }
  const header = request.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    try {
      const decoded = atob(encoded);
      const i = decoded.indexOf(':');
      if (i > -1 && decoded.slice(0, i) === user && decoded.slice(i + 1) === pass) return next();
    } catch (e) { /* fall through */ }
  }
  return new Response('Login required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="RememberMe Admin", charset="UTF-8"' }
  });
}
