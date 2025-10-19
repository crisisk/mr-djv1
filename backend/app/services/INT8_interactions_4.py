// Example usage in your application code
import { twilioService } from './services/sms/twilioService';

async function notifyDJ(djPhone: string, eventDetails: string) {
  const result = await twilioService.sendSMS({
    to: djPhone,
    message: `New booking: ${eventDetails}`,
  });

  if (result.success) {
    console.log(`Message sent successfully! ID: ${result.messageId}`);
  } else {
    console.error(`Failed to send message: ${result.error}`);
  }
}
