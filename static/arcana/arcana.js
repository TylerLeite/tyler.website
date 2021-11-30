async function getDataForPage() {
  const species = require('./data/species.json');
  const stats = require('./data/stats.json');
  const schools = require('./data/schools.json');

  const speciesNames = Object.getOwnPropertyNames(species);
  statsNames = {};
  statsNames.stats = Object.getOwnPropertyNames(stats.stats);
  statsNames.skills = Object.getOwnPropertyNames(stats.skills);

  return {
    species: species,
    stats: stats,
    speciesNames: speciesNames,
    statsNames: statsNames,
    schools: schools,
  };
}

module.exports = {
  getDataForPage,
};
