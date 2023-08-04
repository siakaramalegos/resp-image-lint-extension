async function configureNetRequest(tabId, domain) {
  console.log({ domain });
  const domains = [domain];
  const headers = [
    "X-Frame-Options",
    "Frame-Options",
    "Content-Security-Policy",
  ];

  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [1],
    addRules: [
      {
        id: 1,
        action: {
          type: "modifyHeaders",
          responseHeaders: headers.map((h) => ({
            header: h,
            operation: "remove",
          })),
        },
        condition: {
          requestDomains: domains,
          resourceTypes: ["sub_frame"],
          tabIds: [tabId],
        },
      },
    ],
  });

  await chrome.browsingData.remove(
    {
      origins: domains.map((d) => `https://${d}`),
    },
    {
      cacheStorage: true,
      serviceWorkers: true,
    }
  );
}

chrome.action.onClicked.addListener(async (tab) => {
  const domain = new URL(tab.url).hostname;
  await configureNetRequest(tab.id, domain);

  // Insert the JS file when the user turns the extension on
  await chrome.scripting.executeScript({
    files: ["RespImageLint.js"],
    target: { tabId: tab.id },
  });
});
