// Example usage of the PDF generator
async function generateBookingPDF() {
  const bookingDetails: BookingDetails = {
    bookingId: 'BK-2023-001',
    eventDate: new Date('2023-12-31'),
    clientName: 'John Smith',
    eventType: 'Wedding Reception',
    location: '123 Party Street, Celebration City',
    duration: 5,
    totalAmount: 1200.00,
    depositPaid: 300.00,
    djName: 'DJ Mike'
  };

  const pdfGenerator = new BookingConfirmationPDF();
  
  try {
    const outputPath = `./bookings/confirmation-${bookingDetails.bookingId}.pdf`;
    await pdfGenerator.generateConfirmation(bookingDetails, outputPath);
    console.log(`PDF generated successfully at: ${outputPath}`);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
  }
}

// Run the example
generateBookingPDF();
