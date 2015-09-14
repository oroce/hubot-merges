var format = require('util').format;
var ago = require('damals');

exports.zero = zero;
exports.error = error;
exports.prs = prs;
exports.help = help;

function error(err, options) {
  return {
    message: {
      room: options.room
    },
    content: {
      title: format('Error occured:( (%s)', err.toString()),
      fields: [{
        title: 'Project',
        value: format('<https://github.com/%s/%s|%s/%s>', options.user, options.repo, options.user, options.repo),
        short: true
      }, {
        title: 'Compare',
        value: format('<https://github.com/%s/%s/compare/%s...%s|%s...%s>', options.user, options.repo, options.base, options.head, options.base, options.head)
      }]
    }
  };
}

function zero(options) {
  return {
    message: {
      room: options.room
    },
    content: {
      title: format(
        'There isnt any merged Pull Requests in <https://github.com/%s/%s|%s/%s>',
        options.user,
        options.repo,
        options.user,
        options.repo),
      fields: [{
        title: 'Project',
        value: format('<https://github.com/%s/%s|%s/%s>', options.user, options.repo, options.user, options.repo),
        short: true
      }, {
        title: 'Compare',
        value: format('<https://github.com/%s/%s/compare/%s...%s|%s...%s>', options.user, options.repo, options.base, options.head, options.base, options.head)
      }]
    }
  };
}

function prs(list, options) {
  var lines = list.map(function(pr) {
    return format(
      '<%s|#%s: %s> by <%s|%s> created %s',
      pr.html_url,
      pr.number,
      pr.title,
      pr.user.html_url,
      pr.user.login,
      ago(new Date(pr.created_at))
    );
  });
  return {
    message: {
      room: options.room
    },
    content: {
      text: lines.join('\n'),
      title: format('There are %s pull request%s in <https://github.com/%s/%s|%s/%s> between %s and %s', list.length, list.length < 2 ? '' : 's', options.user, options.repo, options.user, options.repo, options.base, options.head),
      fields: [{
        title: 'Project',
        value: format('<https://github.com/%s/%s|%s/%s>', options.user, options.repo, options.user, options.repo),
        short: true
      }, {
        title: 'Compare',
        value: format('<https://github.com/%s/%s/compare/%s...%s|%s...%s>', options.user, options.repo, options.base, options.head, options.base, options.head)
      }]
    }
  };
}

function help() {
  return [
    'This plugin will list all the merged pull requests:',
    '- hubot merges: compares master with latest release in default user\'s default repo',
    '- hubot merges in jquery: compares master with latest release in default user\'s jquery repo',
    '- hubot merges in johnsmith/jquery: compares master with latest release in user named johnsmith\'s jquery repository',
    '- hubot merges since 2.3.4: compares v2.3.4 release with current master in default user\'s default repo (you can use 2.3.4 or v2.3.4 whichever you like)',
    '- hubot merges since 2.3.4 in jquery: compares v2.3.4 release with current master in default user\'s jquery repository',
    '- hubot merges since v2.3.4 in johnsmith/jquery: compares v2.3.4 release with master in johnsmith\'s jquery repository',
    '- hubot merges between 2.3.4...v2.3.9: compares v2.3.4 with v2.3.9 in default user\'s default repo (you can use 1.2.3 or v1.2.3, you can use two dots or three ones)',
    '- hubot merges between v2.3.4...2.3.9 in jquery: compares v2.3.4 with v2.3.9 in default user\'s jquery repository',
    '- hubot merges between v2.3.4...v2.3.9 in johnsmith/jquery: compares v2.3.4 with v2.3.9 in johnsmith\'s jquery repository'
  ].join('\n');
}
