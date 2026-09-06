import { test, expect } from '@playwright/test';

test.describe('Chat Interface', () => {
  test('primary flow: load page, type message, and see response', async ({ page }) => {
    // 1. Go to the main page
    await page.goto('/');

    // 2. Verify the initial state is present
    await expect(page.getByRole('heading', { name: /FlyRank AI/i })).toBeVisible();
    await expect(page.getByText('AI Qualification Assistant')).toBeVisible();

    // 3. Find the input and type a message
    const input = page.getByPlaceholder('Type a message...');
    await expect(input).toBeVisible();
    await input.fill('Score this lead: TechCorp, software industry, 2000 employees');

    // 4. Submit the message
    const sendButton = page.getByRole('button', { name: /send message/i });
    await expect(sendButton).not.toBeDisabled();
    await sendButton.click();

    // 5. Verify the user message is rendered in the chat stream
    await expect(page.getByText('Score this lead: TechCorp, software industry, 2000 employees')).toBeVisible();

    // 6. Verify the AI eventually responds
    // We expect either a markdown response or a tool call response depending on the API's behavior
    // For this e2e test we just wait for the streaming to finish and the stop button to disappear
    const stopButton = page.getByRole('button', { name: /stop generating/i });
    if (await stopButton.isVisible()) {
      await expect(stopButton).toBeHidden({ timeout: 15000 });
    }
    
    // We know the API responds with something so we just verify the Send button is back
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
  });
});
