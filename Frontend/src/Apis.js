export async function callApi(reqMethod, url, data) {
    let options = {
        method: reqMethod,
        headers: { "Content-Type": "application/json" },
    };

    if (reqMethod !== "GET" && reqMethod !== "DELETE") {
        options.body = JSON.stringify(data); // ✅ Convert to JSON string
    }

    try {
        const response = await fetch(url, options);
        const responseText = await response.text(); // ✅ Read response as text

        console.log("🔹 API Response:", responseText); // ✅ Debug response

        // Check if response is in valid JSON format
        try {
            const jsonData = JSON.parse(responseText);
            return jsonData; // ✅ Return the parsed JSON data
        } catch (jsonError) {
            return { status: "error", message: "Invalid JSON response from server" };
        }
    } catch (error) {
        console.error("❌ API Error:", error);
        return { status: "error", message: "Network error occurred" };
    }
}
