function buildHeaders({ accessToken, includeJson = true } = {}) {
  const headers = {};
  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json().catch(() => ({}));
  }

  const text = await response.text().catch(() => "");
  return { error: text || "Unexpected server response." };
}

async function request(url, options) {
  const response = await fetch(url, options);
  const result = await parseResponse(response);

  if (!response.ok) {
    throw new Error(result.error || "Request failed.");
  }

  return result;
}

export async function createCourseCheckoutSession({ accessToken, courseSlug }) {
  return request("/api/course/checkout", {
    method: "POST",
    headers: buildHeaders({ accessToken }),
    body: JSON.stringify({ courseSlug }),
  });
}

export async function confirmCoursePurchase({ accessToken, courseSlug, sessionId }) {
  return request("/api/course/confirm", {
    method: "POST",
    headers: buildHeaders({ accessToken }),
    body: JSON.stringify({ courseSlug, sessionId }),
  });
}

export async function getCourseAccess({ accessToken, courseSlug }) {
  const search = new URLSearchParams();
  if (courseSlug) {
    search.set("courseSlug", courseSlug);
  }

  return request(`/api/course/access?${search.toString()}`, {
    method: "GET",
    headers: buildHeaders({ accessToken, includeJson: false }),
  });
}
