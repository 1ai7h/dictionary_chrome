document.addEventListener('DOMContentLoaded', function() {
  const definitionElement = document.getElementById('definition');
  
  chrome.storage.local.get(['currentDefinition'], function(result) {
    if (result.currentDefinition) {
      const [word, partOfSpeech, definition, synonyms] = result.currentDefinition.split('|');
      definitionElement.innerHTML = `
        <div class="word">${word}</div>
        ${partOfSpeech ? `<div class="part-of-speech">${partOfSpeech}</div>` : ''}
        <p>${definition}</p>
        ${synonyms ? `<div class="synonyms"><strong>Synonyms:</strong> ${synonyms}</div>` : ''}
      `;
      definitionElement.classList.remove('loading');
    } else {
      definitionElement.textContent = 'Right-click on a word and select "Look up definition" to see its meaning here.';
      definitionElement.classList.remove('loading');
    }
  });
});