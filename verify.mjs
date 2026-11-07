import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const context={window:{}};vm.createContext(context);vm.runInContext(read('catalog.js'),context);vm.runInContext(read('lessons.js'),context);
const {BOOKS,LESSONS}=context.window;assert.equal(BOOKS.length,20);assert.equal(new Set(BOOKS.map(b=>b.id)).size,20);
let count=0,bytes=0,questions=0;
for(const b of BOOKS){const texts=JSON.parse(read(`library/${b.id}/text.json`));assert.equal(texts.length,b.pages,`${b.id} text page count`);assert(fs.existsSync(path.join(root,`library/${b.id}/cover.webp`)));for(let p=1;p<=b.pages;p++){const f=path.join(root,`library/${b.id}/${String(p).padStart(4,'0')}.png`);assert(fs.existsSync(f),`Missing page ${b.id}/${p}`);const s=fs.statSync(f);assert(s.size>0);bytes+=s.size;count++;}}
for(const l of LESSONS){assert(l.sections.length&&l.task);assert.equal(l.questions.length,3);for(const s of l.sources){const b=BOOKS.find(b=>b.id===s.book);assert(b&&s.from>=1&&s.to>=s.from&&s.to<=b.pages,`Invalid source ${l.id}`);}for(const q of l.questions){assert(q.options.length===3&&q.answer>=0&&q.answer<3&&q.explanation);questions++;}}
assert(bytes<950_000_000,'Reading pages exceed the deployment budget');
console.log(JSON.stringify({books:BOOKS.length,pages:count,lessons:LESSONS.length,questions,pageMB:Math.round(bytes/1e6)},null,2));
