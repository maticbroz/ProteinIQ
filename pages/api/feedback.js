// pages/api/feedback.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { toolName, helpful, comment, timestamp } = req.body;

    // Validate required fields
    if (typeof helpful !== 'boolean' || !toolName) {
      return res.status(400).json({ message: 'Invalid feedback data' });
    }

    // Always log feedback (backup)
    console.log('Feedback received:', {
      toolName,
      helpful: helpful ? 'Yes' : 'No',
      comment: comment || 'No comment',
      timestamp: new Date(timestamp).toISOString(),
    });

    // Send email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.FEEDBACK_FROM_EMAIL || 'feedback@resend.dev',
            to: process.env.FEEDBACK_TO_EMAIL || 'your-email@example.com',
            subject: `ProteinIQ Feedback: ${toolName}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333; border-bottom: 2px solid #e5e5e5; padding-bottom: 10px;">
                  New Feedback Received
                </h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 10px 0;"><strong>Tool:</strong> ${toolName}</p>
                  <p style="margin: 10px 0;">
                    <strong>Was it helpful:</strong> 
                    <span style="font-size: 18px;">${helpful ? '👍 Yes' : '👎 No'}</span>
                  </p>
                  <p style="margin: 10px 0;"><strong>Additional Comment:</strong></p>
                  <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #007bff;">
                    ${comment || '<em>No additional comment provided</em>'}
                  </div>
                  <p style="margin: 10px 0; color: #666; font-size: 12px;">
                    <strong>Received:</strong> ${new Date(timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            `,
          }),
        });

        const emailResult = await emailResponse.json();

        if (!emailResponse.ok) {
          console.error('Failed to send email via Resend:', emailResult);
          // Don't fail the request, just log the error
        } else {
          console.log('Email sent successfully:', emailResult.id);
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request, just log the error
      }
    } else {
      console.warn(
        'RESEND_API_KEY not configured, feedback only logged to console'
      );
    }

    res.status(200).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error processing feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
