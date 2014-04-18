
var exec = require('child_process').exec,
  nameMappings = require('./name_mappings.json'),
  fs = require('fs'),
  logArgs = (process.argv.length > 2) ? process.argv.slice(2).join(" ") : '--since=2011-03-09',
  gitCommand = 'git --git-dir=drupal/.git --work-tree=drupal log 8.x ' + logArgs + ' -s --format=%s';

exec(gitCommand, function (error, stdout, stderr) {
  var commits = [],
    reverts = [],
    contributors = {};

  stdout.split("\n").forEach(function(commit) {
    if (commit.indexOf('Revert') == 0) {
      reverts.push(commit.match(/Issue #([0-9]+)/)[1]);
    }
    else {
      commits.push(commit);
    }
  });

  commits = commits.filter(function(commit) {
    var match = commit.match(/Issue #([0-9]+)/);
    return match && reverts.indexOf(match[1]) == -1;
  });

  commits.forEach(function(commit) {
    var peoples = commit.replace("-", "_").match(/\s(?:by\s?)([\w\s,.|]+):/i);
    if (peoples) {
      peoples[1].split(/(?:,|\||\band\b|\bet al(?:.)?)/).forEach(function(name) {
        name = name.trim().toLowerCase();
        if (nameMappings[name]) {
          name = nameMappings[name];

        }
        if (contributors[name]) {
          contributors[name] += 1;
        }
        else {
          contributors[name] = 1;
        }
      });
    }
  });

  var sortable = [],
    sum = 0;
  for (var contributor in contributors) {
    sortable.push([contributor, contributors[contributor]]);
  }
  sortable.sort(function(a, b) {
    return b[1] - a[1];
  });
  contributors = {};
  sortable.forEach(function(sortableItem) {
    contributors[sortableItem[0]] = sortableItem[1];
    sum += sortableItem[1];
  });

  var json = {
    "date": new Date().toISOString(),
    "count": sortable.length,
    "sum": sum,
    "graph": {
      "one": sortable.filter(function(sortableItem) { return sortableItem[1] < 2 }).length,
      "twoTen": sortable.filter(function(sortableItem) { return sortableItem[1] > 1 && sortableItem[1] < 11 }).length,
      "TenOver": sortable.filter(function(sortableItem) { return sortableItem[1] > 10 }).length
    },
    "contributors": contributors
  };

  fs.writeFile("pages/data.json", JSON.stringify(json));
});
