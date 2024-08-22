require('@babel/register');

const fs = require('fs');
const {promisify} = require('util');

const _ = require('lodash');

const Koa = require('koa');
const KoaRouter = require('koa-router');
const forceHTTPS = require('koa-force-https');

const ejs = require('ejs');

const http = require('http');
const https = require('https');

var data = {};

const app = new Koa();
if (!process.env.DEV) {
  console.log("Forcing https")
  app.use(forceHTTPS());
} else {
  console.log("Dev environment, not forcing https")
}

const router = new KoaRouter();

router.get('*', async (ctx, next) => {
  let url = ctx.request.url.split('?')[0];

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
    if (fs.existsSync(test)) {
      [fileType, fileContents] = await getFile(test, ctx.query);
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
      context = await require(jsFile).getDataForPage(params);
    }

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

httpPort = process.env.HTTP_PORT || 80;
httpsPort = process.env.HTTPS_PORT || 443;
try {
  http.createServer(app.callback()).listen(httpPort);
  console.log('Server started on port', httpPort);
} catch (error) {
  console.error('Cannot start server on', httpPort);
}


try {
  const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/psychoca.de/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/psychoca.de/fullchain.pem'),
  };

  https.createServer(options, app.callback()).listen(443);
  console.log('Server started on port 443');
} catch (error) {
  console.error('Could not start https server');
  console.error(error);
}
