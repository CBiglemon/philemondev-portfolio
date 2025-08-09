// api/contact.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const { firstName, lastName, email, company, subject, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Prepare EmailJS API request
    const emailJSData = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: {
        from_name: `${firstName} ${lastName}`,
        from_email: email,
        company: company || "Not specified",
        subject: subject,
        message: message,
      },
    };

    // Send email via EmailJS API
    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailJSData),
      }
    );

    if (!response.ok) {
      throw new Error(`EmailJS API error: ${response.status}`);
    }

    console.log("Email sent successfully via EmailJS");

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);

    return res.status(500).json({
      error: "Failed to send email",
      details: error.message,
    });
  }
}
