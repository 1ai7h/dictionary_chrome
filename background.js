chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lookupDefinition",
    title: "Look up definition",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "lookupDefinition") {
    const word = info.selectionText.trim();
    fetchDefinition(word);
  }
});

async function fetchDefinition(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) {
      if (response.status === 404) {
        showDefinition(`${word}||No definition found. It might be a proper noun or not in the dictionary.||`);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } else {
      const data = await response.json();
      const firstEntry = data[0];
      const firstMeaning = firstEntry.meanings[0];
      const partOfSpeech = firstMeaning.partOfSpeech || '';
      const definition = firstMeaning.definitions[0].definition || 'No definition available.';
      const synonyms = firstMeaning.synonyms || [];
      const synonymsString = synonyms.slice(0, 5).join(', '); // Limit to 5 synonyms
      showDefinition(`${word}|${partOfSpeech}|${definition}|${synonymsString}`);
    }
  } catch (error) {
    console.error('Error fetching definition:', error);
    showDefinition(`${word}||Unable to fetch definition. Please try again later.||`);
  }
}

function showDefinition(message) {
  chrome.storage.local.set({ 'currentDefinition': message }, () => {
    chrome.action.setPopup({ popup: 'popup.html' });
    chrome.action.openPopup();
  });
}