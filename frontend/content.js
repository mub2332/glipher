chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'load') {
    var max = $('.ytp-progress-bar').attr('aria-valuemax');
    var current = $('.ytp-progress-bar').attr('aria-valuenow');
    var title = $(
      'h1.title.style-scope.ytd-video-primary-info-renderer yt-formatted-string'
    )
      .first()
      .text();
    sendResponse({ max, current, title });
  }
});
