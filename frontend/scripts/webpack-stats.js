const color = require('gulp-color'),
      prettyBytes = require('pretty-bytes'),
      path = require('path'),
      fs = require('fs');

//------ TODO: Move to module

function packageParent(name) {
    let paths = name.split(path.sep);
    for (let i = paths.length - 1; i >= 0; --i) {
      let t = paths[i];
      if (t === 'node_modules') {
        i++;
        if (i >= paths.length) { return name; } // no module name?
        if (paths[i][0] === '@') { i++; } // robust test for org package?
        i++;
        if (i >= paths.length) { return name; } // no module name?
        return paths.slice(0, i).join(path.sep);
      }
    }
    return name;
  }
  
  function packageMeta(module) {
    const pj = path.join(module, 'package.json');
    if (!fs.existsSync(pj)) { return undefined; }
    const js = JSON.parse(fs.readFileSync(pj, 'utf8'));
  
    return { version: js.version, name: js.name };
  }
  
  function allMin(hash) {
    const min = [];
    hash.forEach(v => {
      const mins = v.names.filter(n => n.indexOf('.min.') >= 0);
      if (mins.length > 0) { // rough and ready min check
        min.push({ key: v.key, names: mins });
      }
    });
  
    return min;
  }
  
  function allDupes(hash) {
    const d = new Map();
    hash.forEach(v => {
      if (v.module == null) { return; }
      let m = d.get(v.module.name) || { name: v.module.name, instances: [] };
      m.instances.push({ version: v.module.version, path: v.key });
      d.set(v.module.name, m);
    });  
  
    const dupes = [];
    d.forEach(m => {
      if (m.instances.length > 1) {
        dupes.push(m);
      }
    });
  
    return dupes;
  }
  
  function sliceSize(hash, size) {
    let t = 0;
    return hash.filter(e => (t += e.size, t < size)).map(e => ({ key: e.key, size: e.size, pct: e.size/size }));
  }
  
  function sortBySize(hash) {
    const sorted = [...hash.values()].sort((a, b) => b.size - a.size);
  
    return [sorted, sorted.reduce((p,c) => p + c.size, 0)];
  }
  
  function inspectModules(stats) {
    const m = stats.toJson({ maxModules: 999999 }).modules;
  
    const k = m.map(p => ({ size: p.size, name: p.name, key: packageParent(p.name)}));
    const q = new Map();
    k.forEach(p => {
      let t = q.get(p.key) || { key: p.key, size: 0, names: [], module: packageMeta(p.key) };
      t.size = t.size + p.size;
      t.names.push(p.name);
      q.set(p.key, t);
    });
  
    const [sorted, size] = sortBySize(q);
  
    const result = {};
    result.moduleStats = { count: sorted.length, size: size };
    result.the66 = sliceSize(sorted, size * 0.66);
    result.moduleMin = allMin(q);
    result.moduleDupe = allDupes(q);
    return result;
  }
  
  function logStats(logger, stats) {
    console.log(stats.toString({
      colors: true,
      maxModules: 0,
    }));
  
    const result = inspectModules(stats);
  
    result.moduleMin.forEach(e => {
      logger.warn('Possible minified in bundle: %s [ %s ]', color(e.key, 'RED'), color(e.names.join(', '), 'MAGENTA'));
    });
  
    result.moduleDupe.forEach(e => {
      logger.warn('Duplicates in bundle: %s [ %s ]', color(e.name, 'RED'), color(e.instances.map(i => i.version + " => " + i.path).join(', '), 'MAGENTA'));
    });
    
    logger.info('%s across %i modules. Top 66%:', prettyBytes(result.moduleStats.size), result.moduleStats.count);

    result.the66.forEach(e => {
      const scale = 20;
      const cnt = Math.ceil(e.pct * scale);
  
      logger.info('\t%s%s %s\t %s', color('▓'.repeat(cnt), 'YELLOW'), ' '.repeat(scale - cnt), prettyBytes(e.size), color(e.key, 'MAGENTA'));
    });
  
  }

module.exports = {
    logStats: logStats
};  