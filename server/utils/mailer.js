import nodemailer from "nodemailer"
import { config } from "dotenv"

config()

// ✅ Correct: createTransport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendClearanceCompletionEmail(studentEmail, studentName, admissionNumber) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: studentEmail,
    subject: "Clearance Process Completed - School Clearance System",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #28a745;">🎓 Congratulations ${studentName}!</h2>
        <p>Your clearance process has been successfully completed.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Admission Number:</strong> ${admissionNumber}</p>
          <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">COMPLETED</span></p>
        </div>
        <p>You can now download your clearance certificate from the system.</p>
        <p>Thank you for using our clearance system.</p>
        <hr style="margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">
          This is an automated message from the School Clearance System.
        </p>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

export async function sendDepartmentNotificationEmail(studentEmail, studentName, departmentName, message, phoneNumber) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: studentEmail,
    subject: `⚠️ Action Required - ${departmentName} Clearance`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">⚠️ Clearance Action Required</h2>
        <p>Hello <strong>${studentName}</strong>,</p>
        <p>The <strong>${departmentName}</strong> department requires your attention for your clearance process.</p>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h4 style="color: #856404; margin: 0 0 10px 0;">Department Message:</h4>
          <p style="color: #856404; margin: 0;">${message}</p>
        </div>
        
        ${phoneNumber ? `<p><strong>Contact Number:</strong> ${phoneNumber}</p>` : ""}
        
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h4 style="color: #721c24; margin: 0 0 10px 0;">Next Steps:</h4>
          <ul style="color: #721c24; margin: 0; padding-left: 20px;">
            <li>Visit the ${departmentName} department office</li>
            <li>Resolve the issues mentioned above</li>
            <li>Request re-evaluation of your clearance</li>
          </ul>
        </div>
        
        <p>Please address these issues promptly to continue with your clearance process.</p>
        <p>Best regards,<br><strong>School Clearance System</strong></p>
        
        <hr style="margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">
          This is an automated message from the School Clearance System. Please do not reply to this email.
        </p>
      </div>
    `,
  }

  return transporter.sendMail(mailOptions)
}

export async function sendMail(to, subject, html) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  }

  return transporter.sendMail(mailOptions)
}
