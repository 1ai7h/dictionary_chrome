chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.definition) {
    document.getElementById('definition').textContent = request.definition;
  }
});