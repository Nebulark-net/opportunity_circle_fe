export const extractApiPayload = (response) => {
  if (!response) return null;
  return response.data?.data ?? response.data ?? null;
};

export const extractUserFromResponse = (response) => {
  const payload = extractApiPayload(response);
  return payload?.user ?? payload ?? null;
};
