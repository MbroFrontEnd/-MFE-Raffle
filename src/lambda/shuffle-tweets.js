const bluebird = require("bluebird");
const Twitter = require("twitter");
const moment = require("moment-timezone");

const twitterClient = new Twitter({
  consumer_key: "VH1knTeP0QuJH1gefWt6Q",
  consumer_secret: "okk6ctZEbz7Esb2JyGWc6WPcnMFfjubtFHxfL6Df1Y",
  bearer_token:
    "AAAAAAAAAAAAAAAAAAAAAEaQVQAAAAAApvPyP%2BlxAlhF2Lpq0ZiTrSTEU6c%3DM7Qq7HYpLmLNG72sVVQFboMac4vBkGQIJJfLrUUE6TVPSjSjhB"
});

function getWinners(number) {
  const date = moment()
    .tz("Europe/London")
    .format("YYYY-MM-DD");

  return new bluebird((resolve, reject) => {
    twitterClient.get("search/tweets", { q: `#mfejamstack since:${date}` }, function(
      error,
      tweets,
      response
    ) {
      const ignoredUsers = ["@middlesbroughfe", "@lewismorris"];

      let entrants = tweets.statuses
        .map(tweet => {
          return {
            handler: `@${tweet.user.screen_name}`,
            avatar: tweet.user.profile_image_url
          };
        })
        .filter(user => {
          return ignoredUsers.indexOf(user.handler.toLowerCase()) === -1;
        });

      const winners = [];

      for (let i = 0; i < number; i++) {
        const winner = entrants[Math.floor(Math.random() * entrants.length)];
        winners.push(winner);
        entrants = entrants.filter(entrant => entrant !== winner);
      }

      resolve(winners);
    });
  });
}

exports.handler = (event, context, callback) => {
  getWinners(1)
    .then(winners => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({ winners })
      });
    })
    .catch(error => {
      callback(null, {
        statusCode: 500,
        body: {
          error: {
            message: error.message
          }
        }
      });
    });
};
