import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { server$ } from "@builder.io/qwik-city";

/**
 * Utility function to send an email via AWS SES (Ireland Region)
 */
export const sendEmail = server$(async function (to: string, subject: string, body: string) {
  console.log("[SES] Starting email send process...");
  console.log("[SES] Recipient:", to);
  console.log("[SES] Subject:", subject);
  console.log("[SES] Body length:", body.length, "characters");

  // Get AWS credentials from environment variables
  // PUBLIC_ prefix makes it available everywhere in Qwik/Vite
  const accessKeyId = import.meta.env.PUBLIC_AWS_ACCESS_KEY;
  const secretAccessKey = this.env.get("AWS_SECRET_ACCESS_KEY");

  console.log("[SES] Access Key ID present:", !!accessKeyId);
  console.log("[SES] Secret Access Key present:", !!secretAccessKey);

  // Validate that credentials are provided and not empty
  if (!accessKeyId || accessKeyId.trim() === "") {
    console.error("[SES] Missing PUBLIC_AWS_ACCESS_KEY");
    return {
      success: false,
      error: "Missing required AWS credential: PUBLIC_AWS_ACCESS_KEY. Please set this environment variable.",
    };
  }

  if (!secretAccessKey || secretAccessKey.trim() === "") {
    console.error("[SES] Missing AWS_SECRET_ACCESS_KEY");
    return {
      success: false,
      error: "Missing required AWS credential: AWS_SECRET_ACCESS_KEY. Please set this server-side environment variable.",
    };
  }

  console.log("[SES] Credentials validated successfully");

  // Initialize inside the server context to ensure env vars are loaded
  const sesClient = new SESClient({
    region: "eu-west-1", // This is the code for Ireland
    credentials: {
      accessKeyId: accessKeyId.trim(),
      secretAccessKey: secretAccessKey.trim(),
    },
  });

  console.log("[SES] SES client initialized for region: eu-west-1");

  const params = {
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: "g.g.vanderstelt@gmail.com", // This must be verified in the Ireland region
  };

  console.log("[SES] Email parameters prepared:");
  console.log("[SES]   From:", params.Source);
  console.log("[SES]   To:", params.Destination.ToAddresses);
  console.log("[SES]   Subject:", params.Message.Subject.Data);

  try {
    console.log("[SES] Sending email via AWS SES...");
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    
    console.log("[SES] Email sent successfully!");
    console.log("[SES] Message ID:", result.MessageId);
    console.log("[SES] Full response:", JSON.stringify(result, null, 2));
    
    return { success: true, messageId: result.MessageId };
  } catch (error) {
    console.error("[SES] Error sending email:");
    console.error("[SES] Error type:", error?.constructor?.name);
    console.error("[SES] Error message:", (error as Error).message);
    console.error("[SES] Full error:", error);
    
    // Log additional error details if available
    if (error && typeof error === 'object' && 'name' in error) {
      console.error("[SES] Error name:", (error as any).name);
    }
    if (error && typeof error === 'object' && 'code' in error) {
      console.error("[SES] Error code:", (error as any).code);
    }
    if (error && typeof error === 'object' && 'statusCode' in error) {
      console.error("[SES] HTTP status code:", (error as any).statusCode);
    }
    
    return { success: false, error: (error as Error).message };
  }
});