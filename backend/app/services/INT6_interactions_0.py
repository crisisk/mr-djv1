import PDFDocument from 'pdfkit';
import fs from 'fs';
import { Stream } from 'stream';

interface BookingDetails {
  bookingId: string;
  eventDate: Date;
  clientName: string;
  eventType: string;
  location: string;
  duration: number;
  totalAmount: number;
  depositPaid: number;
  djName: string;
}

class BookingConfirmationPDF {
  private doc: PDFKit.PDFDocument;

  constructor() {
    this.doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });
  }

  /**
   * Generates a booking confirmation PDF
   * @param booking Booking details
   * @param outputPath File path for saving the PDF
   * @returns Promise<boolean> Success status
   */
  public async generateConfirmation(
    booking: BookingDetails,
    outputPath: string
  ): Promise<boolean> {
    try {
      // Create write stream
      const stream = fs.createWriteStream(outputPath);
      
      // Pipe the PDF document to the file
      this.doc.pipe(stream);

      // Add header
      this.addHeader();
      
      // Add booking details
      this.addBookingDetails(booking);
      
      // Add terms and conditions
      this.addTermsAndConditions();
      
      // Add footer
      this.addFooter();

      // Finalize the PDF
      this.doc.end();

      return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(true));
        stream.on('error', reject);
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  private addHeader(): void {
    this.doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('Mr. DJ - Booking Confirmation', {
        align: 'center'
      })
      .moveDown(2);
  }

  private addBookingDetails(booking: BookingDetails): void {
    const detailsArray = [
      ['Booking Reference:', booking.bookingId],
      ['Event Date:', booking.eventDate.toLocaleDateString()],
      ['Client Name:', booking.clientName],
      ['Event Type:', booking.eventType],
      ['Location:', booking.location],
      ['Duration:', `${booking.duration} hours`],
      ['Total Amount:', `$${booking.totalAmount.toFixed(2)}`],
      ['Deposit Paid:', `$${booking.depositPaid.toFixed(2)}`],
      ['Balance Due:', `$${(booking.totalAmount - booking.depositPaid).toFixed(2)}`],
      ['DJ Assigned:', booking.djName]
    ];

    this.doc
      .fontSize(12)
      .font('Helvetica');

    detailsArray.forEach(([label, value]) => {
      this.doc
        .text(`${label}`, { continued: true })
        .font('Helvetica-Bold')
        .text(` ${value}`)
        .font('Helvetica')
        .moveDown(0.5);
    });

    this.doc.moveDown(2);
  }

  private addTermsAndConditions(): void {
    const terms = [
      'Terms and Conditions:',
      '1. The remaining balance must be paid 7 days before the event.',
      '2. Cancellations must be made at least 30 days before the event date.',
      '3. The DJ will arrive 1 hour before the event start time for setup.',
      '4. The client must provide adequate power supply and space for equipment.',
      '5. The DJ reserves the right to take reasonable breaks during the event.'
    ];

    this.doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(terms[0])
      .moveDown(1)
      .font('Helvetica')
      .list(terms.slice(1), {
        bulletRadius: 2,
        textIndent: 20
      })
      .moveDown(2);
  }

  private addFooter(): void {
    const currentDate = new Date().toLocaleDateString();
    
    this.doc
      .fontSize(10)
      .text(`Generated on ${currentDate}`, {
        align: 'center'
      })
      .text('Mr. DJ Entertainment Services', {
        align: 'center'
      })
      .text('Phone: (555) 123-4567 | Email: bookings@mrdj.com', {
        align: 'center'
      });
  }
}

export { BookingConfirmationPDF, BookingDetails };
