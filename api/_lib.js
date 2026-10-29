export const PREFIX = 'library/';
export const CATS = ['scene', 'character', 'prop', 'lighting', 'motion', 'ui', 'other'];
export const EXTS = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };

// 文件路径格式：library/<类别>/<时间戳>-<随机>__<base64url 编码的名字>.<扩展名>
export const PATH_RE = /^library\/([a-z]+)\/([a-z0-9]+)-([a-z0-9]+)__([A-Za-z0-9_-]+)\.(png|jpg|webp|gif)$/;

export function encodeName(name) {
  return Buffer.from(name, 'utf8').toString('base64url');
}

export function parseBlob(b) {
  const m = b.pathname.match(PATH_RE);
  if (!m || !CATS.includes(m[1])) return null;
  let name;
  try { name = Buffer.from(m[4], 'base64url').toString('utf8'); } catch (e) { return null; }
  return {
    pathname: b.pathname,
    url: b.url,
    downloadUrl: b.downloadUrl,
    cat: m[1],
    id: m[2] + '-' + m[3],
    name,
    ext: m[5],
    size: b.size,
    createdAt: parseInt(m[2], 36) || 0
  };
}

export function cleanName(name) {
  return String(name || '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 120);
}
