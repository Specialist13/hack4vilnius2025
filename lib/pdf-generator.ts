import type { FormData } from "@/app/documents/page"
import { jsPDF } from "jspdf"

export async function generatePDF(formData: FormData) {
  const isApartment = formData.propertyType === "apartment"
  const needsCoOwnerDocs = isApartment && formData.hasCoOwnerConsent === "no"

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  let yPos = 20
  const leftMargin = 15
  const rightMargin = 15
  const pageWidth = 210
  const contentWidth = pageWidth - leftMargin - rightMargin

  // Helper functions
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    doc.setFontSize(options.fontSize || 10)
    doc.setFont("helvetica", options.bold ? "bold" : "normal")
    if (options.align === "center") {
      doc.text(text, pageWidth / 2, y, { align: "center" })
    } else {
      doc.text(text, x, y)
    }
  }

  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + (lines.length * fontSize * 0.4)
  }

  // Page 1: Application Header
  doc.setFillColor(37, 99, 235)
  doc.rect(0, 0, pageWidth, 40, "F")
  doc.setTextColor(255, 255, 255)
  addText("EV CHARGING STATION DOCUMENTS", pageWidth / 2, 20, { fontSize: 20, bold: true, align: "center" })
  addText("Legal Document Package", pageWidth / 2, 28, { fontSize: 12, align: "center" })
  addText(new Date().toLocaleDateString(), pageWidth / 2, 34, { fontSize: 9, align: "center" })

  // Reset text color
  doc.setTextColor(0, 0, 0)
  yPos = 50

  // Document 1 Header
  doc.setFillColor(243, 244, 246)
  doc.rect(leftMargin, yPos, contentWidth, 8, "F")
  addText("DOCUMENT #1: APPLICATION", leftMargin + 2, yPos + 5.5, { fontSize: 12, bold: true })
  yPos += 15

  addText("Application for EV Charging Station Installation", pageWidth / 2, yPos, { fontSize: 11, bold: true, align: "center" })
  yPos += 10

  // Applicant Information
  addText("APPLICANT INFORMATION:", leftMargin, yPos, { bold: true })
  yPos += 6
  addText(`Full Name: ${formData.fullName}`, leftMargin, yPos)
  yPos += 5
  addText(`Personal Code: ${formData.personalCode}`, leftMargin, yPos)
  yPos += 5
  addText(`Address: ${formData.address}`, leftMargin, yPos)
  yPos += 5
  if (isApartment) {
    addText(`Apartment Number: ${formData.apartmentNumber}`, leftMargin, yPos)
    yPos += 5
  }
  addText(`Phone: ${formData.phone}`, leftMargin, yPos)
  yPos += 5
  addText(`Email: ${formData.email}`, leftMargin, yPos)
  yPos += 10

  // Request section
  addText(isApartment ? "I REQUEST PERMISSION TO INSTALL:" : "I INFORM ABOUT THE INTENTION TO INSTALL:", leftMargin, yPos, { bold: true })
  yPos += 6
  const requestText = `An electric vehicle charging station ${isApartment ? `at parking space No. ${formData.parkingSpot || "TBD"}` : "on my property"}, located ${formData.parkingLocation}.`
  yPos = addWrappedText(requestText, leftMargin, yPos, contentWidth)
  yPos += 5

  // Charging station parameters
  addText("CHARGING STATION PARAMETERS:", leftMargin, yPos, { bold: true })
  yPos += 6
  addText(`• Type: ${formData.chargerType}`, leftMargin + 5, yPos)
  yPos += 5
  addText(`• Power: ${formData.power} kW`, leftMargin + 5, yPos)
  yPos += 5
  addText(`• Number of connectors: ${formData.connectors}`, leftMargin + 5, yPos)
  yPos += 5
  if (formData.chargerModel) {
    addText(`• Model: ${formData.chargerModel}`, leftMargin + 5, yPos)
    yPos += 5
  }
  yPos += 5

  // Commitments
  addText("COMMITMENTS:", leftMargin, yPos, { bold: true })
  yPos += 6
  const commitments = [
    "Comply with all construction and electrical safety requirements",
    "Use only certified and new equipment",
    "Commission installation works to certified contractor with VERT certificate",
    "Properly operate and maintain the installed station"
  ]
  if (isApartment) {
    commitments.push("Compensate for damage to common objects, if any")
  }
  commitments.forEach(commitment => {
    yPos = addWrappedText(`• ${commitment}`, leftMargin + 5, yPos, contentWidth - 10, 9)
    yPos += 2
  })
  yPos += 10

  // Signature
  addText("Applicant: ___________________________", leftMargin, yPos)
  yPos += 5
  addText(`(${formData.fullName})`, leftMargin + 30, yPos, { fontSize: 9 })
  yPos += 5
  addText(`Date: ${new Date().toLocaleDateString()}`, leftMargin, yPos)

  // Page 2: Co-owner consent (if needed)
  if (needsCoOwnerDocs) {
    doc.addPage()
    yPos = 20

    doc.setFillColor(243, 244, 246)
    doc.rect(leftMargin, yPos, contentWidth, 8, "F")
    addText("DOCUMENT #2: CO-OWNER CONSENT FORM", leftMargin + 2, yPos + 5.5, { fontSize: 12, bold: true })
    yPos += 15

    addText(`Apartment Building ${formData.address}`, pageWidth / 2, yPos, { fontSize: 11, bold: true, align: "center" })
    yPos += 6
    addText("CO-OWNERS CONSENT", pageWidth / 2, yPos, { fontSize: 11, bold: true, align: "center" })
    yPos += 6
    addText("FOR EV CHARGING STATION INSTALLATION", pageWidth / 2, yPos, { fontSize: 11, bold: true, align: "center" })
    yPos += 12

    const consentText = `We, the undersigned apartment and premises owners, CONSENT to ${formData.fullName}, owner of apartment No. ${formData.apartmentNumber}, installing an electric vehicle charging station at parking space No. ${formData.parkingSpot || "TBD"}.`
    yPos = addWrappedText(consentText, leftMargin, yPos, contentWidth, 10)
    yPos += 8

    addText("CHARGING STATION PARAMETERS:", leftMargin, yPos, { bold: true })
    yPos += 6
    addText(`• Power: ${formData.power} kW`, leftMargin + 5, yPos)
    yPos += 5
    addText(`• Type: ${formData.chargerType}`, leftMargin + 5, yPos)
    yPos += 5
    addText(`• Number of connectors: ${formData.connectors}`, leftMargin + 5, yPos)
    yPos += 10

    addText("CONDITIONS:", leftMargin, yPos, { bold: true })
    yPos += 6
    const conditions = [
      "Station will be installed according to construction and electrical requirements",
      "Only certified and new equipment will be used",
      "Works will be performed by certified contractor with VERT certificate",
      "ESO connection conditions will be obtained and fulfilled",
      "Applicant commits to compensate for damage, if any"
    ]
    conditions.forEach((condition, i) => {
      yPos = addWrappedText(`${i + 1}. ${condition}`, leftMargin + 5, yPos, contentWidth - 10, 9)
      yPos += 2
    })
    yPos += 8

    addText("CO-OWNERS SIGNATURE TABLE:", leftMargin, yPos, { bold: true })
    yPos += 8

    // Table
    const tableStartY = yPos
    const colWidths = [10, 20, 50, 35, 30, 25]
    const rowHeight = 8

    // Header
    doc.setFillColor(229, 231, 235)
    doc.rect(leftMargin, yPos, contentWidth, rowHeight, "F")
    doc.setFontSize(9)
    doc.setFont("helvetica", "bold")
    let xPos = leftMargin + 2
    doc.text("No.", xPos, yPos + 5.5)
    xPos += colWidths[0]
    doc.text("Apt.", xPos, yPos + 5.5)
    xPos += colWidths[1]
    doc.text("Owner Name", xPos, yPos + 5.5)
    xPos += colWidths[2]
    doc.text("Personal Code", xPos, yPos + 5.5)
    xPos += colWidths[3]
    doc.text("Signature", xPos, yPos + 5.5)
    xPos += colWidths[4]
    doc.text("Date", xPos, yPos + 5.5)

    doc.setFont("helvetica", "normal")
    yPos += rowHeight

    // Rows
    for (let i = 0; i < 10; i++) {
      doc.rect(leftMargin, yPos, contentWidth, rowHeight, "S")
      doc.text(`${i + 1}.`, leftMargin + 2, yPos + 5.5)

      // Draw column lines
      xPos = leftMargin
      colWidths.forEach(width => {
        xPos += width
        doc.line(xPos, yPos, xPos, yPos + rowHeight)
      })

      yPos += rowHeight
    }

    yPos += 5
    doc.setFontSize(8)
    doc.setFont("helvetica", "italic")
    const noteText = "NOTE: According to Civil Code (Article 4.75), consent of ALL owners is required."
    yPos = addWrappedText(noteText, leftMargin, yPos, contentWidth, 8)
  }

  // Page 3: Instructions
  doc.addPage()
  yPos = 20

  doc.setFillColor(16, 185, 129)
  doc.rect(0, 0, pageWidth, 30, "F")
  doc.setTextColor(255, 255, 255)
  addText("INSTRUCTIONS AND NEXT STEPS", pageWidth / 2, 18, { fontSize: 16, bold: true, align: "center" })
  doc.setTextColor(0, 0, 0)
  yPos = 40

  let stepNum = 1

  if (needsCoOwnerDocs) {
    doc.setFillColor(219, 234, 254)
    doc.rect(leftMargin, yPos, contentWidth, 25, "F")
    doc.setFillColor(37, 99, 235)
    doc.circle(leftMargin + 5, yPos + 5, 3, "F")
    doc.setTextColor(255, 255, 255)
    addText(stepNum.toString(), leftMargin + 5, yPos + 6.5, { fontSize: 9, bold: true, align: "center" })
    doc.setTextColor(0, 0, 0)
    addText("Collect co-owner consents", leftMargin + 12, yPos + 6, { bold: true })
    yPos += 8
    const step1Text = "Use the template in this PDF (Document #2). Collect all co-owner signatures or call a general meeting and confirm the decision by protocol. Time: 1-4 weeks."
    yPos = addWrappedText(step1Text, leftMargin + 5, yPos, contentWidth - 10, 9)
    yPos += 10
    stepNum++
  }

  // Step: Real Estate Register
  doc.setFillColor(254, 243, 199)
  doc.rect(leftMargin, yPos, contentWidth, 30, "F")
  doc.setFillColor(245, 158, 11)
  doc.circle(leftMargin + 5, yPos + 5, 3, "F")
  doc.setTextColor(255, 255, 255)
  addText(stepNum.toString(), leftMargin + 5, yPos + 6.5, { fontSize: 9, bold: true, align: "center" })
  doc.setTextColor(0, 0, 0)
  addText("Obtain Real Estate Register extract", leftMargin + 12, yPos + 6, { bold: true })
  yPos += 8
  addText("How to obtain:", leftMargin + 5, yPos, { bold: true, fontSize: 9 })
  yPos += 4
  addText("• Online: www.registrucentras.lt/paslaugos", leftMargin + 5, yPos, { fontSize: 9 })
  yPos += 4
  addText("• Tel.: 1884 (weekdays 8-17)", leftMargin + 5, yPos, { fontSize: 9 })
  yPos += 4
  addText("• Cost: 2-3 EUR  |  Duration: Immediate (electronic)", leftMargin + 5, yPos, { fontSize: 9 })
  yPos += 10
  stepNum++

  // Step: ESO
  doc.setFillColor(224, 231, 255)
  doc.rect(leftMargin, yPos, contentWidth, 30, "F")
  doc.setFillColor(99, 102, 241)
  doc.circle(leftMargin + 5, yPos + 5, 3, "F")
  doc.setTextColor(255, 255, 255)
  addText(stepNum.toString(), leftMargin + 5, yPos + 6.5, { fontSize: 9, bold: true, align: "center" })
  doc.setTextColor(0, 0, 0)
  addText("Contact ESO for connection conditions", leftMargin + 12, yPos + 6, { bold: true })
  yPos += 8
  addText("How to obtain:", leftMargin + 5, yPos, { bold: true, fontSize: 9 })
  yPos += 4
  addText("• Online: www.eso.lt > Services > New object connection", leftMargin + 5, yPos, { fontSize: 9 })
  yPos += 4
  addText("• Tel.: 1852 (weekdays 8-17)", leftMargin + 5, yPos, { fontSize: 9 })
  yPos += 4
  addText("• Duration: 5-10 business days  |  Cost: Free", leftMargin + 5, yPos, { fontSize: 9 })
  yPos += 10
  stepNum++

  // Step: ENA Subsidy
  doc.setFillColor(220, 252, 231)
  doc.rect(leftMargin, yPos, contentWidth, 32, "F")
  doc.setFillColor(16, 185, 129)
  doc.circle(leftMargin + 5, yPos + 5, 3, "F")
  doc.setTextColor(255, 255, 255)
  addText(stepNum.toString(), leftMargin + 5, yPos + 6.5, { fontSize: 9, bold: true, align: "center" })
  doc.setTextColor(0, 0, 0)
  addText("Apply for ENA subsidy", leftMargin + 12, yPos + 6, { bold: true })
  yPos += 8
  addText("Subsidy amount:", leftMargin + 5, yPos, { bold: true, fontSize: 9 })
  yPos += 4
  addText(`• ${isApartment ? "Apartments" : "Private houses"}: up to ${isApartment ? "60%" : "40%"} (max. 1,500 EUR)`, leftMargin + 5, yPos, { fontSize: 9 })
  yPos += 6
  addText("Application: www.ena.lt", leftMargin + 5, yPos, { bold: true, fontSize: 9 })
  yPos += 5
  doc.setTextColor(220, 38, 38)
  addText("⚠️ IMPORTANT: Apply BEFORE installation!", leftMargin + 5, yPos, { bold: true, fontSize: 9 })
  doc.setTextColor(0, 0, 0)
  yPos += 10

  // Contacts box
  doc.setDrawColor(229, 231, 235)
  doc.setFillColor(249, 250, 251)
  doc.rect(leftMargin, yPos, contentWidth, 25, "FD")
  yPos += 5
  addText("📞 CONTACTS", leftMargin + 2, yPos, { bold: true })
  yPos += 6
  addText("ENA (Energy Agency): www.ena.lt, info@ena.lt", leftMargin + 2, yPos, { fontSize: 9 })
  yPos += 5
  addText("ESO (Electricity Distribution): www.eso.lt, tel. 1852", leftMargin + 2, yPos, { fontSize: 9 })
  yPos += 5
  addText("Registry Center: www.registrucentras.lt, tel. 1884", leftMargin + 2, yPos, { fontSize: 9 })

  // Save the PDF
  doc.save(`ev-docs-${formData.fullName.replace(/\s+/g, "-")}.pdf`)
}

