const openAnalyticsScript = "https://c.getopen.so/oa.js";

export async function mockOpenAnalytics(target) {
  await target.route(openAnalyticsScript, async (route) => {
    await route.fulfill({ body: "", contentType: "application/javascript", status: 200 });
  });
}
