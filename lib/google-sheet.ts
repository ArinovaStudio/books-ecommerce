export async function sendToGoogleSheet(data: any) {
  try {
    const response = await fetch(process.env.GOOGLE_SHEET_WEBHOOK!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: new Date().toISOString(),
        ...data,
      }),
    });

    const result = await response.text();

    // console.log("STATUS:", response.status);
    // console.log("RESULT:", result);

    return result;
  } catch (error: any) {
    console.error(error);
    return error.message;
  }
}
