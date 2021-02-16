async function getData () {
  const species = require('./data/species.json');
  const stats = require('./data/stats.json');
  const schools = require('./data/schools.json');

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

module.exports = {getData};
