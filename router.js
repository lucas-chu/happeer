const { response } = require('express');
var express = require('express');
var router = express.Router();
const snoowrap = require('snoowrap');

const r = new snoowrap({
  userAgent: 'wholesome bot by /u/circleguy12 v1.0',
});

var subreddits = subreddits = ['aww', 'eyebleach', 'wholesomememes']
var s = subreddits.join('+')
var p = Promise.resolve(r.getSubreddit(s).getTop({
  limit: 10,
  time: 'day'
}));

p.then(function(posts) {
  
  router.post('/more', function(req, res, next) {
    const postAmount = posts.length
    posts.fetchMore({amount: 10}).then(extendedPosts => {
      extendedPosts.splice(0, postAmount)
      posts = extendedPosts
      return res.json(parsePosts(extendedPosts))
    })
  })

  router.post('/', function(req, res, next) {
    return res.json(parsePosts(posts))
  })
})

router.get('/', function(req, res, next) {
  return res.sendFile('index.html', {
    root: __dirname
  })
});

function parsePosts(posts) {
  var responsePosts = []
  posts.forEach(post => {
    let ret = {}
    if (post.url.includes("v.redd")) {
      ret = {
        'title': post.title,
        'url': post.url,
        'is_video': true,
        'plink': post.permalink,
        'v_url': post.media.reddit_video.fallback_url
      }
    } else if (post.url.includes("gfycat")) {
      ret = {
        'title': post.title,
        'url': post.url,
        'plink': post.permalink,
        'gfy': post.media.oembed.html,
        'is_video': false
      }
    } else {
      ret = {
        'title': post.title,
        'url': post.url,
        'plink': post.permalink,
        'is_video': false
      }
    }
    responsePosts.push(ret)
  })
  return responsePosts
}

module.exports = router;
