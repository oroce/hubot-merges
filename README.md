hubot-merges
====

It shows what pull requests has been merged since last release or compares two releases.

# For what?

- To find out whether you need to release a patch, major or minor
- To be able to write the changelog for given releases based on the merged pull requests

## Semver FTW

or it isn't, it's on you. But you would like to know what changes you will release if you hit the release button or you tag a new version. For this you just need to run:
~~~
hubot merges in purposeindustries/hubot-merges
~~~

## Changelog

We do love changelog. But sometimes we forgot to write it because we are in hurry, this plugin comes handy in those cases, what did we merge for that given release:
~~~
hubot merges between v1.2.3...v1.2.4 in purposeindustries/hubot-merges
~~~



# Commands

* `hubot merges`: compares master with latest release in default user's default repo
* `hubot merges in jquery`: compares master with latest release in default user's jquery repo
* `hubot merges in johnsmith/jquery`: compares master with latest release in user named johnsmith's jquery repository
* `hubot merges since 2.3.4`: compares v2.3.4 release with current master in default user's default repo (you can use 2.3.4 or v2.3.4 whichever you like)
* `hubot merges since 2.3.4 in jquery`: compares v2.3.4 release with current master in default user's jquery repository
* `hubot merges since v2.3.4 in johnsmith/jquery`: compares v2.3.4 release with master in johnsmith's jquery repository
* `hubot merges between 2.3.4...v2.3.9`: compares v2.3.4 with v2.3.9 in default user's default repo (you can use 1.2.3 or v1.2.3, you can use two dots or three ones)
* `hubot merges between v2.3.4...2.3.9 in jquery`: compares v2.3.4 with v2.3.9 in default user's jquery repository
* `hubot merges between v2.3.4...v2.3.9 in johnsmith/jquery`: compares v2.3.4 with v2.3.9 in johnsmith's jquery repository

# Environemnt variables

All variables are optional.

* `HUBOT_MERGES_GITHUB_TOKEN`: GitHub token to be used for querying github api, for private projects you need to set it.
* `HUBOT_MERGES_GITHUB_USER`: Default user
* `HUBOT_MERGES_GITHUB_REPO`: Default repo
* `HUBOT_MERGES_SLACK`: If you enable this, the plugin wont output plain text rather it'll use [slack's attachment api](https://api.slack.com/docs/attachments)

# License

MIT
