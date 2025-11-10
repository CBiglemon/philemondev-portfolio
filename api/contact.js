// api/contact.js - Simplified version without problematic validation
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { firstName, lastName, email, company, subject, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Use environment variables directly without trim() in case that's the issue
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;

    // Log without exposing the actual values
    console.log("Environment variables status:", {
      hasServiceId: !!serviceId,
      hasTemplateId: !!templateId,
      hasPublicKey: !!publicKey,
      serviceIdLength: serviceId?.length || 0,
      templateIdLength: templateId?.length || 0,
      publicKeyLength: publicKey?.length || 0,
    });

    // If any are missing, fail gracefully without exposing keys
    if (!serviceId || !templateId || !publicKey) {
      console.error("Environment variables missing or empty");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const emailJSData = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        from_name: `${firstName} ${lastName}`,
        from_email: email,
        company: company || "Not specified",
        subject: subject,
        message: message,
      },
    };

    console.log("Sending email request to EmailJS API...", {
      hasServiceId: !!emailJSData.service_id,
      hasTemplateId: !!emailJSData.template_id,
      hasUserId: !!emailJSData.user_id,
      templateParamsKeys: Object.keys(emailJSData.template_params),
    });

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
