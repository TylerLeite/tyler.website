const fs = require('fs');
const {promisify} = require('util');

async function getDataForPage() {
  const storyDir = './static/writing/stories/';
  let stories = [];

  const readdir = promisify(fs.readdir);
  const filens = fs.readdirSync(storyDir);

  for (let i = 0; i < filens.length; i++) {
    filen = storyDir + filens[i];
    if (filen.includes('.json')) {
      continue;
    }
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

module.exports = {
  getDataForPage,
};
