var merges = require('../lib/merges')
var objectAssign = require('object-assign');
var format = require('util').format;
var addVersion = require('../lib/add-version');

var print = require('../lib/print/default');
var slack = require('../lib/print/slack');

module.exports = function(robot) {
  robot.on('slack-attachment', function(m) {
    console.log(JSON.stringify(m, null, 2));
  });
  var github = require('githubot')(robot);
  var options = objectAssign({}, {
    defaultBranch: 'master',
    defaultUser: process.env.HUBOT_MERGES_GITHUB_USER,
    defaultRepo: process.env.HUBOT_MERGES_GITHUB_REPO,
    token: process.env.HUBOT_MERGES_GITHUB_TOKEN,
    slack: process.env.HUBOT_MERGES_SLACK
  }, {/* options */});

  robot.respond(/merges h(elp)?$/i, function(msg) {
    if (options.slack) {
      return robot.emit('slack-attachment', slack.help());
    }
    return msg.send(print.help());
  });

  robot.respond(/merges$/i, function(msg) {
    handler({
      user: options.defaultUser,
      repo: options.defaultRepo,
      base: 'latest',
      head: options.defaultBranch,
      token: options.token
    }, msg);
  });

  robot.respond(/merges in ([a-zA-Z0-9-_]+\/)?([a-zA-Z0-9-_]+)$/i, function(msg) {
    var user = (msg.match[1] || '').slice(0, -1);
    var repo = msg.match[2];
    handler({
      user: user || options.defaultUser,
      repo: repo,
      base: 'latest',
      head: options.defaultBranch,
      token: options.token
    }, msg);
  });

  robot.respond(/merges since (v?\d+\.\d+\.\d+)$/i, function(msg) {
    var base = addVersion(msg.match[1]);
    handler({
      user: options.defaultUser,
      repo: options.defaultRepo,
      base: base,
      head: options.defaultBranch,
      token: options.token
    }, msg);
  });

  robot.respond(/merges since (v?\d+\.\d+\.\d+) in ([a-zA-Z0-9-_]+\/)?([a-zA-Z0-9-_]+)$/i, function(msg) {
    var base = addVersion(msg.match[1]);
    var user = (msg.match[2] || '').slice(0, -1);
    var repo = msg.match[3];
    handler({
      user: user || options.defaultUser,
      repo: repo,
      base: base,
      head: options.defaultBranch,
      token: options.token
    }, msg);
  });

  robot.respond(/merges (between )?(v?\d+\.\d+\.\d+)\.\.\.?(v?\d+\.\d+\.\d+)$/i, function(msg) {
    var base = addVersion(msg.match[2]);
    var head = addVersion(msg.match[3]);
    handler({
      user: options.defaultUser,
      repo: options.defaultRepo,
      base: base,
      head: head,
      token: options.token
    }, msg);
  });

  robot.respond(/merges (between )?(v?\d+\.\d+\.\d+)\.\.\.?(v?\d+\.\d+\.\d+) in ([a-zA-Z0-9-_]+\/)?([a-zA-Z0-9-_]+)$/i, function(msg) {
    var base = addVersion(msg.match[2]);
    var head = addVersion(msg.match[3]);
    var user = (msg.match[4] || '').slice(0, -1);
    var repo = msg.match[5];
    handler({
      user: user || options.defaultUser,
      repo: repo,
      base: base,
      head: head,
      token: options.token
    }, msg);
  });


  function handler(opts, msg) {
    opts.room = msg.message.room;
    merges(opts, function(err, mergedPrs) {
      if (err) {
        robot.logger.error(err);
        if (options.slack) {
          return robot.emit('slack-attachment', slack.error(err, opts));
        }
        return msg.send(print.error(err, opts));
      }
      if (mergedPrs.length === 0) {
        if (options.slack) {
          return robot.emit('slack-attachment', slack.zero(opts));
        }
        return msg.send(print.zero(opts));
      }

      if (options.slack) {
        return robot.emit('slack-attachment', slack.prs(mergedPrs, opts));
      }
      msg.send(print.prs(mergedPrs, opts));
    });
  }
};
