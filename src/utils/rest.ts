import fetch from "node-fetch";

export const apiPost = async (url: string, body: any, headers: any) => {
  try {
    let response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: headers,
    });
    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }
    let json = await response.json();
    return json;
  } catch (err) {
    console.warn(err);
    throw new Error(err.message);
  }
};
