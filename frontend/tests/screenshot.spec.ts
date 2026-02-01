import { test, expect } from "@playwright/test";

test("screenshot homepage", async ({ page }) => {
	// Navigate to the app
	await page.goto("http://localhost:8080/");

	// Wait for the app to load (check for specific elements)
	await page.waitForSelector(".app", { timeout: 30000 });

	// Wait for 3D canvas to render
	await page.waitForTimeout(5000);

	// Take screenshot
	await page.screenshot({
		path: "test-results/homepage-screenshot.png",
		fullPage: false,
	});

	console.log("Screenshot saved to test-results/homepage-screenshot.png");
});
