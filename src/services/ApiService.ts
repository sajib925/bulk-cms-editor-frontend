import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_DATA_CLIENT_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getRegisteredSiteInfo = async (siteId: string) => {
  const res = await client.get(`/webflow/site/${siteId}`);

  return res.data;
};

const checkingScripts = async (siteId: string) => {
  const res = await client.post(`/webflow/register-app-scripts`, JSON.stringify({ siteId }));
  return res.data;
};

export const ApiService = {
  getRegisteredSiteInfo,
  checkingScripts,
};
