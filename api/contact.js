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

    // Debug: Check environment variables in production
    console.log("Production Environment Check:", {
      hasServiceId: !!process.env.EMAILJS_SERVICE_ID,
      hasTemplateId: !!process.env.EMAILJS_TEMPLATE_ID,
      hasPublicKey: !!process.env.EMAILJS_PUBLIC_KEY,
      serviceIdLength: process.env.EMAILJS_SERVICE_ID?.length,
      templateIdLength: process.env.EMAILJS_TEMPLATE_ID?.length,
      publicKeyLength: process.env.EMAILJS_PUBLIC_KEY?.length,
    });

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if environment variables are missing
    if (
      !process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
      !process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    ) {
      console.error("Missing environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Prepare EmailJS API request
    const emailJSData = {
      service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
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

    const responseText = await response.text();
    console.log("EmailJS API Response:", {
      status: response.status,
      statusText: response.statusText,
      body: responseText,
    });

    if (!response.ok) {
      throw new Error(
        `EmailJS API error: ${response.status} - ${responseText}`
      );
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
