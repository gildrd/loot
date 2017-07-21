'use strict';

(function exportModule(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['bower_components/octokat/dist/octokat.js'], factory);
  } else {
    // Browser globals
    root.loot = root.loot || {};
    root.loot.updateExists = factory(root.Octokat);
  }
}(this, (Octokat) => {
  const versionRegex = /^(\d+)\.(\d+)\.(\d+)$/;

  function compare(lhs, rhs) {
    if (!versionRegex.test(lhs) || !versionRegex.test(rhs)) {
      throw new Error(`versions to compare are of unexpected format: ${lhs}, ${rhs}`);
    }

    const lhsNumbers = lhs.split('.');
    const rhsNumbers = rhs.split('.');

    for (let i = 0; i < lhsNumbers.length; i += 1) {
      const lhsNumber = Number(lhsNumbers[i]);
      const rhsNumber = Number(rhsNumbers[i]);

      if (lhsNumber < rhsNumber) {
        return -1;
      }

      if (rhsNumber < lhsNumber) {
        return 1;
      }
    }

    return 0;
  }

  return (currentVersion, currentBuild) => {
    if (currentVersion === undefined || currentBuild === undefined) {
      return Promise.reject(new Error('Invalid arguments, both version and build must be given'));
    }

    const repo = (new Octokat()).repos('loot', 'loot');

    return repo.releases.latest.fetch().then((latestRelease) => {
      const comparison = compare(currentVersion, latestRelease.tagName);
      if (comparison === -1) {
        return true;
      } else if (comparison === 1) {
        return false;
      }

      /* Versions are equal, compare the build commit date with the release tag
         commit's date. If the latter is newer, there's an update available. */
      return repo.tags.fetch().then((tags) => (
        tags.items.find((element) => element.name === latestRelease.tagName)
      )).then((tag) => {
        if (tag.commit.sha.startsWith(currentBuild)) {
          return false;
        }

        return repo.commits(tag.commit.sha).fetch()
          .then((tagCommit) => Date.parse(tagCommit.commit.committer.date))
          .then((tagDate) => (
            repo.commits(currentBuild).fetch().then((buildCommit) => (
              tagDate > Date.parse(buildCommit.commit.committer.date)
            ))
          ));
      });
    }).catch((error) => {
      if (!error.message) {
        console.error(error);
      } else {
        throw error;
      }
    });
  };
}));
