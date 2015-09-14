
var async = require('async');
var request = require('request').defaults({
  headers: {
    'User-Agent': 'hubot-merges module'
  },
  json: true
});
var format = require('util').format;

function merges(opts, cb) {
  //console.log('opts=', opts);
  if (opts.base === 'latest') {
    // get the latest
    return request({
      url: format('https://api.github.com/repos/%s/%s/releases/latest', opts.user, opts.repo),
      qs: {
        access_token: opts.token
      }
    }, function(err, res, release) {
      if (err) {
        return cb(err);
      }
      var tagName = release.tag_name;
      opts.base = tagName;

      compare(opts, cb);
    })
  }
  compare(opts, cb);
}

function compare(opts, cb) {
  var url = format('https://api.github.com/repos/%s/%s/compare/%s...%s', opts.user, opts.repo, opts.base, opts.head);

  request({
    url: url,
    qs: {
      access_token: opts.token
    }
  }, function(err, res, body) {
    if (err) {
      return cb(err);
    }
    if (res.statusCode > 399) {
      return cb(new Error(body.message || ('Unknown github response, status: ' + res.statusCode)));
    }

    var merges = body.commits
      .filter(function(commit) {
        return commit.commit.message.indexOf('Merge pull request') !== -1;
      })
      .map(function(commit) {
        return commit.commit.message.match(/#(\d+)/gm)[0].slice(1);
      });

    if (merges.length === 0) {
      return cb(null, []);
    }
    diffPrs(opts, merges, cb);
  });
}

function diffPrs(opts, prs, cb) {
  async.mapSeries(prs, function(pr, cb) {
    diffPr(opts, pr, cb);
  }, cb);
}

function diffPr(opts, pr, cb) {
  var url = format('https://api.github.com/repos/%s/%s/pulls/%s', opts.user, opts.repo, pr);
  request({
    url: url,
    qs: {
      access_token: opts.token
    }
  }, function(err, res, body) {
    if (err) {
      return cb(err);
    }
    cb(null, body);
  });
}
module.exports = merges;
