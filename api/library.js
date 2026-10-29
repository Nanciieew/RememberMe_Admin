import { list, rename, del } from '@vercel/blob';
import { PREFIX, parseBlob, encodeName, cleanName } from './_lib.js';

async function listAll() {
  const items = [];
  let cursor;
  do {
    const res = await list({ prefix: PREFIX, cursor, limit: 1000 });
    res.blobs.forEach(b => { const it = parseBlob(b); if (it) items.push(it); });
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  return items;
}

// GET：列出全部参考图
export async function GET() {
  try {
    return Response.json({ items: await listAll() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return Response.json({ error: 'list_failed', message: e.message }, { status: 500 });
  }
}

// POST：{ action: 'rename', pathname, name } 或 { action: 'delete', pathname }
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch (e) { return Response.json({ error: 'bad_json' }, { status: 400 }); }
  const items = await listAll();
  const item = items.find(i => i.pathname === body.pathname);
  if (!item) return Response.json({ error: 'not_found' }, { status: 404 });

  if (body.action === 'delete') {
    await del(item.url);
    return Response.json({ ok: true });
  }

  if (body.action === 'rename') {
    const name = cleanName(body.name);
    if (!name) return Response.json({ error: 'empty_name' }, { status: 400 });
    const lower = name.toLowerCase();
    if (items.some(i => i.pathname !== item.pathname && i.name.trim().toLowerCase() === lower)) {
      return Response.json({ error: 'duplicate_name' }, { status: 409 });
    }
    const to = `${PREFIX}${item.cat}/${item.id}__${encodeName(name)}.${item.ext}`;
    const res = await rename(item.url, to, { access: 'public' });
    return Response.json({ ok: true, item: parseBlob({ ...res, size: item.size }) });
  }

  return Response.json({ error: 'unknown_action' }, { status: 400 });
}
