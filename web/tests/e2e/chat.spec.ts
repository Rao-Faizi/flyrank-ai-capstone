import { test, expect } from '@playwright/test';

test.describe('Chat Interface', () => {
  test('primary flow: load page, type message, and see response', async ({ page }) => {
    // Mock the AI route so we don't call the real API in CI
    await page.route('/api/chat', async route => {
      // Create a mock stream response that AI SDK can parse
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('0:"Here is the qualification score for TechCorp: 85/100."\n'));
          controller.close();
        }
      });
      
      await route.fulfill({
        status: 200,
        contentType: 'text/plain; charset=utf-8',
        headers: {
          'x-vercel-ai-data-stream': 'v1'
        },
        body: '0:"Here is the qualification score for TechCorp: 85/100."\n'
      });
    });

    // 1. Go to the main page
    await page.goto('/');

    // 2. Verify the initial state is present
    await expect(page.getByRole('heading', { name: /Central Qualification AI/i })).toBeVisible();
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

    // 6. Verify the AI eventually responds with our mocked data
    await expect(page.getByText('Here is the qualification score for TechCorp: 85/100.')).toBeVisible({ timeout: 15000 });
    
    // We know the API responds with something so we just verify the Send button is back
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible();
  });
});
