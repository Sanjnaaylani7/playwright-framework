const logger = require('./logger');

/**
 * Registers a one-time handler for the NEXT alert / confirm / prompt dialog.
 * Call it BEFORE the action that triggers the dialog. Returns a promise that resolves with the dialog message.
 */
function handleNextDialog(page, { action = 'accept', promptText } = {}) {
  return new Promise((resolve) => {
    page.once('dialog', async (dialog) => {
      const message = dialog.message();
      logger.info(`Dialog [${dialog.type()}]: "${message}" -> ${action}`);
      if (action === 'accept') await dialog.accept(promptText);
      else await dialog.dismiss();
      resolve(message);
    });
  });
}

/** Handles a popup / new tab opened by `triggerFn` and returns the new Page. */
async function handlePopup(page, triggerFn) {
  const [popup] = await Promise.all([page.waitForEvent('popup'), triggerFn()]);
  await popup.waitForLoadState();
  logger.info(`Popup opened: ${popup.url()}`);
  return popup;
}

module.exports = { handleNextDialog, handlePopup };
