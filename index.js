require('@babel/register');

const fs = require('fs');
const {promisify} = require('util');

const _ = require('lodash');

const Koa = require('koa');
const KoaRouter = require('koa-router');
const ejs = require('ejs');

const app = new Koa();
const router = new KoaRouter();

router.get('*', async (ctx, next) => {
  let url = ctx.request.url;

  const urlparts = _.filter(url.split('/'), el => !!el);

  if (urlparts.length == 0) {
    urlparts.push('home');
  }

  // if there is no file ending, assume it's a page
  if (urlparts[urlparts.length-1].split('.').length == 1) {
    urlparts.push(urlparts[urlparts.length-1] + '.ejs');
  }

  let fileType, fileContents, pageData;
  for (let i = 0; i < urlparts.length; i++) {
    let test = './static/' + urlparts.slice(0, urlparts.length-i).join('/');
    if (fs.existsSync(test)) {
      [fileType, fileContents] = await getFile(test, urlparts.slice(urlparts.length-1));
      break;
    }
  }

  ctx.type = fileType;
  ctx.body = fileContents;
});

function getFileNameForPage (url) {
  return './static/' + url + '/' + url + '.ejs';
}

async function getFile (file, params) {
  let fileParts = file.split('.');
  let extension = fileParts.pop();

  let data = fs.readFileSync(file);
  if (extension == 'ejs') {
    let context = {};
    jsFile = fileParts.join('.') + '.js';
    if (fs.existsSync(jsFile)) {
      context = await require(jsFile).getDataForPage();
    }

    extension = 'html';
    data = ejs.render(data.toString('utf8'), context);
  }

  return [extension, data];
}

app.use(async (ctx, next) => {
  await next();
  console.log(`${new Date()} ${ctx.method} ${ctx.url}`)
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = 80;
app.listen(port);
console.log('Server started on port ' + port);
