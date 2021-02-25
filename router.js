const { response } = require('express');
var express = require('express');
var router = express.Router();
const snoowrap = require('snoowrap');

const r = new snoowrap({
  userAgent: 'zach"s reddit',
  clientId: 'FTEzEhIr0XB_mw',
  clientSecret: 'lpySAc_TvUA8VT2JaiVTRMSIbf7uiw',
  refreshToken: '12899792823-eZJoRdm5HDdF8y-XlKszVLOgVpsofw'
});

var subreddits = subreddits = ['aww', 'eyebleach', 'wholesomememes', 'blessedimages', 'wholesome', 'animalsthatlovemagic']
var currentPostIndex = 0
var s = subreddits.join('+')
var p = Promise.resolve(r.getSubreddit(s).getTop({
  limit: 10,
  time: 'day'
}));

p.then(function(posts) {
  
  function getMore() {
    posts.fetchMore({amount: 10}).then(extendedPosts => {
      posts = extendedPosts
    })
  }

  router.post('/', function(req, res, next) {
    const holdIndex = currentPostIndex
    currentPostIndex += 1;
    if (currentPostIndex >= posts.length - 3) {
      getMore();
    }
    const post = parsePost(posts[holdIndex])
    return res.json(post)
  })
})

router.get('/', function(req, res, next) {
  return res.sendFile('index.html', {
    root: __dirname
  })
});

function parsePost(post) {
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
  return ret
}

module.exports = router;
