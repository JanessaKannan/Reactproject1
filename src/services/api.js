import axios from "axios";

const api = axios.create({
  baseURL: "https://mock-api.com",
  timeout: 10_000,
});

const BASE_MOCK = {
  traffic: [120, 200, 150, 300, 250],
  sales: [
    { category: "Electronics", value: 5000 },
    { category: "Clothing", value: 3000 },
    { category: "Books", value: 2000 },
  ],
  users: [
    { region: "Asia", value: 40 },
    { region: "Europe", value: 25 },
    { region: "America", value: 35 },
  ],
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getTrafficMultiplier(dateRange) {
  if (dateRange === "last90") return 1.35;
  if (dateRange === "last30") return 1.15;
  return 1;
}

function buildMockAnalytics(filters) {
  const { category, region, dateRange, sort } = filters ?? {};

  const mult = getTrafficMultiplier(dateRange);
  const traffic = BASE_MOCK.traffic.map((v) => Math.round(v * mult));

  let sales = BASE_MOCK.sales;
  if (category && category !== "all") {
    sales = sales.filter((s) => s.category === category);
  }
  if (sort === "lowest") sales = [...sales].sort((a, b) => a.value - b.value);
  if (sort === "highest") sales = [...sales].sort((a, b) => b.value - a.value);

  let users = BASE_MOCK.users;
  if (region && region !== "all") {
    users = users.filter((u) => u.region === region);
  }

  return { traffic, sales, users };
}

/**
 * Fetch analytics data from the API.
 * Falls back to mock data if the API isn't reachable (common for mock URLs).
 */
export async function getAnalytics(filters) {
  try {
    const params = {};
    if (filters?.category && filters.category !== "all")
      params.category = filters.category;
    if (filters?.region && filters.region !== "all")
      params.region = filters.region;
    if (filters?.dateRange) params.dateRange = filters.dateRange;
    if (filters?.sort) params.sort = filters.sort;

    const res = await api.get("/analytics", { params });
    return res.data;
  } catch (err) {
    // Keep UI fully functional even without a real backend.
    await sleep(450);
    return buildMockAnalytics(filters);
  }
}
