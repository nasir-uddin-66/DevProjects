// Print helper utilities

export const printSection = (
  sectionId: string,
  pageTitle: string = "Order Details"
) => {
  const element = document.getElementById(sectionId);
  if (!element) {
    console.error(`Print section with id "${sectionId}" not found`);
    return;
  }

  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    console.error("Failed to open print window");
    return;
  }

  // Get logo - use hardcoded path
  const logoSrc = "/src/assets/brand_logo.png";

  // Create the print HTML with professional styling
  const printHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>StitchCraft - ${pageTitle}</title>
      <link href="https://fonts.googleapis.com/css2?family=Lobster:wght@400&family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Lobster:wght@400&family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        * {
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }

        body {
          font-family: 'Poppins', sans-serif !important;
          color: #333 !important;
          background: #fff !important;
          padding: 25px !important;
          line-height: 1.7 !important;
        }

        .print-wrapper {
          max-width: 950px !important;
          margin: 0 auto !important;
          background: #fff !important;
        }

        /* Header Section */
        .print-header {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          margin-bottom: 25px !important;
          padding-bottom: 20px !important;
          border-bottom: 4px solid #1fb854 !important;
          gap: 20px !important;
        }

        .header-left {
          display: flex !important;
          align-items: center !important;
          gap: 18px !important;
        }

        .print-logo {
          width: 90px !important;
          height: 90px !important;
          border-radius: 12px !important;
          border: 3px solid #1fb854 !important;
          padding: 8px !important;
          background: linear-gradient(135deg, #f0f8f5 0%, #e8f5f0 100%) !important;
          object-fit: contain !important;
        }

        .brand-section {
          display: flex !important;
          flex-direction: column !important;
          gap: 3px !important;
        }

        .brand-name {
          font-family: 'Lobster', cursive !important;
          font-size: 46px !important;
          color: #54c07a !important;
          margin: 0 !important;
          font-weight: 400 !important;
          letter-spacing: 1px !important;
          line-height: 1 !important;
        }

        .brand-tagline {
          font-size: 11px !important;
          color: #1fb854 !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
        }

        .header-right {
          text-align: right !important;
        }

        .report-title {
          font-size: 22px !important;
          font-weight: 700 !important;
          color: #1b1717 !important;
          margin-bottom: 6px !important;
          font-family: 'Playfair Display', serif !important;
        }

        .report-meta {
          font-size: 10px !important;
          color: #999 !important;
          line-height: 1.5 !important;
        }

        /* Override ALL styles - Most Important */
        * {
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          text-decoration: none !important;
          background: transparent !important;
          border: none !important;
          color: #333 !important;
          font-size: inherit !important;
        }

        html, body {
          background: #fff !important;
          color: #333 !important;
        }

        body {
          font-family: 'Poppins', sans-serif !important;
          color: #333 !important;
          padding: 12px !important;
          line-height: 1.5 !important;
        }

        .print-wrapper {
          max-width: 950px !important;
          margin: 0 auto !important;
          background: #fff !important;
          width: 100% !important;
        }

        /* Header Section */
        .print-header {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          margin-bottom: 12px !important;
          padding-bottom: 10px !important;
          border-bottom: 3px solid #1fb854 !important;
          gap: 15px !important;
          background: transparent !important;
        }

        .header-left {
          display: flex !important;
          align-items: center !important;
          gap: 18px !important;
          background: transparent !important;
        }

        .print-logo {
          width: 70px !important;
          height: 70px !important;
          border-radius: 8px !important;
          border: 2px solid #1fb854 !important;
          padding: 4px !important;
          background: linear-gradient(135deg, #f0f8f5 0%, #e8f5f0 100%) !important;
          object-fit: contain !important;
          display: block !important;
        }

        .brand-section {
          display: flex !important;
          flex-direction: column !important;
          gap: 3px !important;
          background: transparent !important;
        }

        .brand-name {
          font-family: 'Lobster', cursive !important;
          font-size: 36px !important;
          color: #54c07a !important;
          margin: 0 !important;
          font-weight: 400 !important;
          letter-spacing: 0.5px !important;
          line-height: 1 !important;
          background: transparent !important;
        }

        .brand-tagline {
          font-size: 11px !important;
          color: #1fb854 !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 1px !important;
          background: transparent !important;
        }

        .header-right {
          text-align: right !important;
          background: transparent !important;
        }

        .report-title {
          font-size: 18px !important;
          font-weight: 700 !important;
          color: #54c07a !important;
          margin-bottom: 3px !important;
          font-family: 'Lobster', cursive !important;
          background: transparent !important;
        }

        .report-meta {
          font-size: 8px !important;
          color: #999 !important;
          line-height: 1.3 !important;
          background: transparent !important;
        }

        .report-meta div {
          margin: 1px 0 !important;
          color: #999 !important;
          background: transparent !important;
        }

        /* Content wrapper - convert to table layout */
        #print-content {
          width: 100% !important;
          margin: 20px 0 !important;
          background: #fff !important;
          display: block !important;
        }

        #print-content * {
          color: #333 !important;
          background: transparent !important;
          font-family: 'Poppins', sans-serif !important;
        }

        #print-content > * {
          background: transparent !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
          color: #333 !important;
        }

        #print-content div,
        #print-content span,
        #print-content p {
          color: #333 !important;
          background: transparent !important;
          font-size: 11px !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Convert any div section to table-like layout */
        #print-content > div {
          display: block !important;
          margin: 10px 0 !important;
          padding: 0 !important;
        }

        #print-content > div > h3,
        #print-content > div > div > h3 {
          font-family: 'Roboto', cursive !important;
          color: #54c07a !important;
          font-weight: 700 !important;
          font-size: 12px !important;
          margin-bottom: 8px !important;
          padding-bottom: 5px !important;
          border-bottom: 2px solid #1fb854 !important;
        }

        /* Grid to table for key-value pairs */
        #print-content .grid {
          display: table !important;
          width: 100% !important;
          border: 1px solid #ddd !important;
          margin-bottom: 10px !important;
        }

        #print-content .grid > div {
          display: table-row !important;
        }

        #print-content .grid > div > p:first-child,
        #print-content .grid > div > span:first-child {
          display: table-cell !important;
          font-weight: 700 !important;
          color: #fff !important;
          background: linear-gradient(90deg, #1fb854 0%, #178a3f 100%) !important;
          padding: 8px 12px !important;
          width: 40% !important;
          border-right: 1px solid #ddd !important;
        }

        #print-content .grid > div > p:last-child,
        #print-content .grid > div > span:last-child {
          display: table-cell !important;
          padding: 8px 12px !important;
          color: #333 !important;
          font-weight: 600 !important;
        }

        #print-content .grid > div:nth-child(even) > p:last-child,
        #print-content .grid > div:nth-child(even) > span:last-child {
          background: #f9f9f9 !important;
        }

        /* All tables */
        table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 8px 0 !important;
          font-size: 10px !important;
          page-break-inside: avoid !important;
          background: #fff !important;
          border: 1px solid #ddd !important;
        }

        thead, thead tr {
          background: linear-gradient(90deg, #1fb854 0%, #178a3f 100%) !important;
          color: #fff !important;
        }

        th {
          padding: 8px !important;
          text-align: left !important;
          font-weight: 700 !important;
          letter-spacing: 0.3px !important;
          font-size: 10px !important;
          color: #fff !important;
          background: linear-gradient(90deg, #1fb854 0%, #178a3f 100%) !important;
          border: 1px solid #178a3f !important;
        }

        tbody tr {
          background: transparent !important;
        }

        tbody tr:nth-child(even) {
          background-color: #f9f9f9 !important;
        }

        tbody tr:nth-child(odd) {
          background-color: #fff !important;
        }

        td {
          padding: 6px 10px !important;
          border: 1px solid #ddd !important;
          color: #333 !important;
          background: inherit !important;
          font-size: 10px !important;
        }

        tfoot {
          background-color: #f5f5f5 !important;
          font-weight: 600 !important;
        }

        tfoot td {
          padding: 12px !important;
          border-top: 2px solid #1fb854 !important;
          border-bottom: 2px solid #1fb854 !important;
          background: #f5f5f5 !important;
          color: #333 !important;
        }

        /* Status Colors - with high specificity */
        .status-pending {
          color: #f59e0b !important;
          font-weight: 700 !important;
          font-family: 'Lobster', cursive !important;
          font-size: 11px !important;
        }

        .status-confirmed {
          color: #3b82f6 !important;
          font-weight: 700 !important;
          font-family: 'Lobster', cursive !important;
          font-size: 11px !important;
        }

        .status-processing {
          color: #8b5cf6 !important;
          font-weight: 700 !important;
          font-family: 'Lobster', cursive !important;
          font-size: 11px !important;
        }

        .status-completed {
          color: #10b981 !important;
          font-weight: 700 !important;
          font-family: 'Lobster', cursive !important;
          font-size: 11px !important;
        }

        .status-paid {
          color: #10b981 !important;
          font-weight: 700 !important;
          font-family: 'Lobster', cursive !important;
          font-size: 11px !important;
        }

        .status-unpaid {
          color: #ef4444 !important;
          font-weight: 700 !important;
          font-family: 'Lobster', cursive !important;
          font-size: 11px !important;
        }

        /* Text with status keywords */
        span, div, td {
          color: #333 !important;
        }

        /* Section Heading */
        h3, .section-heading {
          font-size: 11px !important;
          font-weight: 700 !important;
          color: #fff !important;
          background: linear-gradient(90deg, #1fb854 0%, #178a3f 100%) !important;
          padding: 6px 10px !important;
          margin: 8px 0 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          page-break-after: avoid !important;
          display: block !important;
          width: 100% !important;
          border: none !important;
          font-family: 'Lobster', cursive !important;
        }

        h1, h2, h4, h5, h6 {
          background: transparent !important;
          color: #54c07a !important;
          margin: 6px 0 !important;
          font-family: 'Lobster', cursive !important;
          font-size: 12px !important;
        }

        /* Any element that looks like a heading */
        #print-content > div:first-child,
        #print-content > div > div:first-child,
        div[class*="heading"],
        div[class*="title"],
        p:has(+ table),
        p:has(+ div[class*="grid"]),
        #print-content h3,
        #print-content h2,
        #print-content h4 {
          font-family: 'Lobster', cursive !important;
          color: #54c07a !important;
          font-weight: 700 !important;
          font-size: 12px !important;
          background: transparent !important;
          margin: 8px 0 !important;
          padding-bottom: 5px !important;
          border-bottom: 2px solid #1fb854 !important;
        }

        /* Make all p tags within sections display nicely */
        #print-content > div > p {
          padding: 5px 0 !important;
          line-height: 1.4 !important;
        }

        /* Amount Styling */
        .amount {
          font-weight: 700 !important;
          color: #1b1717 !important;
          text-align: right !important;
        }

        .amount-paid {
          color: #10b981 !important;
          font-weight: 700 !important;
        }

        .amount-due {
          color: #ef4444 !important;
          font-weight: 700 !important;
        }

        /* Delivery Information Section */
        div[class*="delivery"],
        div[class*="address"],
        div[class*="information"],
        div[class*="info"] {
          border: 1px solid #ddd !important;
          padding: 10px !important;
          margin: 8px 0 !important;
          border-radius: 4px !important;
          background: #f9f9f9 !important;
        }

        div[class*="delivery"] > div,
        div[class*="address"] > div,
        div[class*="information"] > div,
        div[class*="info"] > div {
          display: flex !important;
          justify-content: space-between !important;
          margin: 4px 0 !important;
          font-size: 10px !important;
        }

        div[class*="delivery"] > div > span:first-child,
        div[class*="address"] > div > span:first-child,
        div[class*="information"] > div > span:first-child,
        div[class*="info"] > div > span:first-child {
          font-weight: 700 !important;
          color: #1fb854 !important;
        }
        .measurements-grid,
        .measurements,
        div[class*="measurement"],
        div[class*="grid"] {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important;
          gap: 8px !important;
          width: 100% !important;
          margin: 8px 0 !important;
          background: transparent !important;
          padding: 0 !important;
        }

        .measurement-item,
        .grid-item,
        div[class*="measurement-item"],
        div[class*="grid"] > div {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          background: linear-gradient(135deg, #f0f8f5 0%, #e8f5f0 100%) !important;
          border: 2px solid #1fb854 !important;
          border-radius: 4px !important;
          padding: 8px !important;
          text-align: center !important;
          color: #333 !important;
          min-height: 60px !important;
          margin: 0 !important;
        }

        .measurement-label,
        .label,
        div[class*="measurement-label"],
        div[class*="label"] {
          font-size: 9px !important;
          font-weight: 700 !important;
          color: #1fb854 !important;
          text-transform: uppercase !important;
          margin-bottom: 5px !important;
          letter-spacing: 0.5px !important;
          background: transparent !important;
          padding: 0 !important;
        }

        .measurement-value,
        .value,
        div[class*="measurement-value"],
        div[class*="value"] {
          font-size: 14px !important;
          font-weight: 700 !important;
          color: #54c07a !important;
          margin-bottom: 2px !important;
          background: transparent !important;
          padding: 0 !important;
          font-family: 'Lobster', cursive !important;
        }

        .measurement-unit,
        .unit,
        div[class*="measurement-unit"],
        div[class*="unit"] {
          font-size: 9px !important;
          color: #999 !important;
          background: transparent !important;
          padding: 0 !important;
        }
        .print-footer {
          margin-top: 10px !important;
          padding-top: 8px !important;
          border-top: 2px solid #1fb854 !important;
          text-align: center !important;
          background: transparent !important;
        }

        .footer-text {
          font-size: 9px !important;
          color: #666 !important;
          margin: 3px 0 !important;
          background: transparent !important;
        }

        .footer-text strong {
          color: #54c07a !important;
          font-weight: 700 !important;
          background: transparent !important;
          font-family: 'Lobster', cursive !important;
        }

        .footer-contact {
          font-size: 8px !important;
          color: #999 !important;
          margin-top: 3px !important;
          background: transparent !important;
        }

        .footer-contact div {
          margin: 1px 0 !important;
          background: transparent !important;
        }

        .footer-signature {
          font-size: 7px !important;
          color: #bbb !important;
          margin-top: 5px !important;
          background: transparent !important;
        }

        /* Hide non-print elements */
        .no-print, button, .btn, nav, header, .sidebar, .back-button, i[class*="fa"] {
          display: none !important;
        }

        /* Page Setup */
        @page {
          size: A4 !important;
          margin: 0.4in !important;
        }

        @media print {
          body {
            padding: 15px !important;
          }

          .print-wrapper {
            padding: 0 !important;
          }

          table {
            page-break-inside: avoid !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-wrapper">
        <!-- Header -->
        <div class="print-header">
          <div class="header-left">
            ${
              logoSrc
                ? `<img src="${logoSrc}" alt="StitchCraft" class="print-logo" />`
                : ""
            }
            <div class="brand-section">
              <h1 class="brand-name">StitchCraft</h1>
              <div class="brand-tagline">Professional Tailoring Services</div>
            </div>
          </div>
          <div class="header-right">
            <div class="report-title">${pageTitle}</div>
            <div class="report-meta">
              <div>Printed: ${new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}</div>
              <div>${new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}</div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div id="print-content" class="print-section">
          ${element.innerHTML}
        </div>

        <!-- Footer -->
        <div class="print-footer">
          <div class="footer-text">Thank you for choosing <strong>StitchCraft</strong>!</div>
          <div class="footer-contact">
            <div>📧 info@stitchcraft.com | 📱 +880 1234-567890</div>
            <div>📍 Dhaka, Bangladesh</div>
          </div>
          <div class="footer-signature">
            This is a computer-generated document. No signature required.
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(printHTML);
  printWindow.document.close();

  // Trigger print dialog
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };
};
