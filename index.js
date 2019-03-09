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

  let fileType, fileContents;
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
  if (file == 'writing') {
    return getDataForPage_writing();
  } else if (file == 'arcana') {
    return getDataForPage_arcana();
  } else {
    return {};
  }
}

async function getDataForPage_arcana() {
  const species = require('./static/arcana/data/species.json');
  const stats = require('./static/arcana/data/stats.json');
  const schools = require('./static/arcana/data/schools.json');

  const speciesNames = Object.getOwnPropertyNames(species);
  statsNames = {};
  statsNames.stats = Object.getOwnPropertyNames(stats.stats);
  statsNames.skills = Object.getOwnPropertyNames(stats.skills);

  return {
    species_d: species,
    stats_d: stats,
    speciesNames_d: speciesNames,
    statsNames_d: statsNames,
    schools_d: schools,
  };
}

async function getDataForPage_writing() {
  const storyDir = './static/writing/stories/';
  let stories = [];

  const readdir = promisify(fs.readdir);
  const filens = fs.readdirSync(storyDir);

  for (let i = 0; i < filens.length; i++) {
    filen = storyDir + filens[i];
    const content = fs.readFileSync(filen);
    stories.push({
      title: filens[i],
      slugTitle: filens[i].toLowerCase().split(' ').join('-'),
      content: content.toString('utf8').split('\n'),
    });
  }

  return {
    stories,
  };
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