export async function uploadToGCS(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    // your backend endpoint that uploads to GCS
    const response = await fetch("/api/uploads/profile-image", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Image upload failed");
    }

    const data = await response.json();

    // expected backend response:
    // { url: "https://storage.googleapis.com/..." }
    return data.url;
}
