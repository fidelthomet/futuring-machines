import { font } from './pdf-font.js'
import { jsPDF } from 'jspdf'

async function sendPDFToServer(pdfBlob) {
  try {
    const response = await fetch('/backend/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/pdf'
      },
      body: pdfBlob
    });
    if (response.ok) {
      console.log('File uploaded successfully', response.data);
    } else {
      console.log('File could not be uploaded');
    }
  } catch (error) {
    console.error('Error uploading file', error);
    alert('Failed to upload file. Please try again.');
  }
}


export function saveStoryAsPDF(editor) {
  try {
    const doc = new jsPDF();
    const storyText = editor.getText(); // Get the plain text from the editor

    // Load IBM Plex Mono font
    doc.addFileToVFS("IBMPlexMono-Regular-normal.ttf", font);
    doc.addFont("IBMPlexMono-Regular-normal.ttf", "IBMPlexMono-Regular", "normal");
    // Prompt user for name, surname, and title
    const name = prompt('Please enter your name:', '');
    const title = prompt('Please enter the title:', 'Document Title');

    if (!name || !title) {
      alert('All fields are required!');
      return;
    }

    // Example Base64 encoded background image (a small transparent image)
    const backgroundImageBase64 = '/src/assets/images/Frame_70c.png'; 
    // Function to add background image to a page
    const addBackgroundImage = (doc, base64Image) => {
      try {
        doc.addImage(base64Image, 'JPEG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, '', 'FAST');
      } catch (error) {
        console.error('Error adding background image:', error);
      }
    };

    // Add background image to the first page
    addBackgroundImage(doc, backgroundImageBase64);

    // // Add header with curved corners
    // doc.setDrawColor(0); // Border color
    // doc.setFillColor(255); // Fill color
    // doc.roundedRect(10, 10, doc.internal.pageSize.width - 20, 40, 10, 10, 'FD');

    // Draw frame for user info and title
doc.setDrawColor(0); // Set border color to black
doc.setFillColor(255); // Set fill color to white

const frameWidth = 160; // Adjust the width of the frames as needed

// Draw filled rectangle for shadow effect
doc.setFillColor(0); // Set fill color to black for shadow
for (let i = 0; i < 3; i++) {
  doc.roundedRect(18 - i, 18 - i, frameWidth + 14, 24, 15, 15, 'F'); // Frame for user info
}

// Draw filled rectangle for shadow effect
for (let i = 0; i < 3; i++) {
  doc.roundedRect(18 - i, 8 - i, frameWidth + 14, 39, 15,15, 'F'); // Frame for title
}

// Draw white frame for user info and title
doc.setFillColor(255); // Set fill color back to white
doc.roundedRect(15, 15, frameWidth + 10, 20, 15,15, 'FD'); // Frame for user info
doc.roundedRect(15, 5, frameWidth + 10, 35, 15, 15, 'FD'); // Frame for title

    // Centered title text
    doc.setFont("IBMPlexMono-Regular", "normal");
    doc.setFontSize(19);
    doc.text(title, doc.internal.pageSize.width / 2, 25, null, null, 'center');

    // Author and date information
    doc.setFont("IBMPlexMono-Regular", "normal");
    doc.setFontSize(10);
    doc.text(`Author: ${name}`, 10, doc.internal.pageSize.height - 49);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, doc.internal.pageSize.height - 44);

    // Set the maximum width for text and page height
    const maxWidth = (doc.internal.pageSize.width - 30) / 2; // Two columns
    const pageHeight = doc.internal.pageSize.height - 60; // Adjust the margin as needed

    // Split text into lines that fit the maximum width
    const lines = doc.splitTextToSize(storyText, maxWidth);

    // Define variables for pagination and columns
    let cursorY = 60; // Start cursor below the header
    const lineHeight = 5;
    let column = 0;

    // Add story text in two columns
    lines.forEach((line) => {
      if (cursorY + lineHeight > pageHeight) {
        column++;
        if (column >= 2) {
          // Add a new page if both columns are full
          doc.addPage();
          cursorY = 60; // Reset cursorY for the new page
          column = 0; // Reset column
          
          // Add background image to the new page
          addBackgroundImage(doc, backgroundImageBase64);
        } else {
          cursorY = 60; // Reset cursorY for the new column
        }
      }
      const xPosition = column === 0 ? 15 : doc.internal.pageSize.width / 2 + 5;
      doc.text(line, xPosition, cursorY);
      cursorY += lineHeight; // Move cursorY down for the next line
    });

    // Save the document
    doc.setProperties({ compression: 'SLOW' });
    doc.save('document.pdf');
    const pdfBlob = doc.output('blob');
    sendPDFToServer(pdfBlob);
    console.log('PDF created successfully');
  } catch (error) {
    console.error('Error creating PDF:', error);
  }
}

