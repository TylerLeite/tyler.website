require('@babel/register');

const fs = require('fs');
const {promisify} = require('util');

const _ = require('lodash');

const Koa = require('koa');
const KoaRouter = require('koa-router');
const ejs = require('ejs');

const http = require('http');
const https = require('https');

var data = {};

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

  let fileType, fileContents;
  for (let i = 0; i < urlparts.length; i++) {
    let test = './static/' + urlparts.slice(0, urlparts.length-i).join('/');
    console.log(test)
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
  let extension = file.split('.').pop();

  let data = fs.readFileSync(file);
  if (extension == 'ejs') {
    const context = await getDataForPage(file);
    extension = 'html';
    data = ejs.render(data.toString('utf8'), context);
  }

  return [extension, data];
}

async function getDataForPage (file) {
  file = file.split('/').pop().split('.')[0];

  if (!data[file]) {
    try {
      data[file] = require('./static/' + file + '/' + file + '.js').getData;
    } catch (e) {
      data[file] = () => {return {}};
    }
  }

  return data[file]();
}

app.use(async (ctx, next) => {
  await next();
  console.log(`${new Date()} ${ctx.method} ${ctx.url}`)
});

app.use(router.routes());
app.use(router.allowedMethods());

http.createServer(app.callback()).listen(80);
console.log('Server started on ports 80');

try {
  const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/cooltyler.fun/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/cooltyler.fun/fullchain.pem'),
  };

  https.createServer(options, app.callback()).listen(443);
  console.log('Server started on port 443');
} catch (error) {
  console.error('Could not start https server');
}
