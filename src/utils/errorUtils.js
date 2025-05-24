export function extractErrorMessage(err) {
  if (err.response?.data?.message) {
    return err.response.data.message;
  }


  if (err instanceof Error && typeof err.message === 'string') {
    err = err.message;
  }


  if (typeof err === 'string') {
    let str = err.trim();
    if (str.startsWith('"') && str.endsWith('"')) {
      try {
        str = JSON.parse(str);
      } catch {
      }
    }

    try {
      const obj = JSON.parse(str);
      return obj.message || str;
    } catch {
      return str;
    }
  }

  return String(err);
}