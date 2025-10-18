import type { FormData } from "@/app/documents/page"
import type { TDocumentDefinitions, Content } from "pdfmake/interfaces"

type TranslationFunction = (key: string, values?: Record<string, any>) => string

export async function generatePDF(formData: FormData, t: TranslationFunction, locale: string = 'en') {
  // Dynamically import pdfmake to avoid SSR issues
  const pdfMakeModule = await import('pdfmake/build/pdfmake')
  const pdfFontsModule = await import('pdfmake/build/vfs_fonts')

  const pdfMake = pdfMakeModule.default
  const pdfFonts = pdfFontsModule.default

  // Initialize pdfMake with fonts - pdfFonts is the vfs object directly
  pdfMake.vfs = pdfFonts

  const isApartment = formData.propertyType === "apartment"
  const needsCoOwnerDocs = isApartment && formData.hasCoOwnerConsent === "no"

  const currentDate = new Date().toLocaleDateString(locale === 'lt' ? 'lt-LT' : 'en-US')

  // Helper function to pass through to translation with values
  const tr = (key: string, values?: Record<string, any>) => {
    if (values && Object.keys(values).length > 0) {
      return t(key, values)
    }
    return t(key)
  }

  const content: Content[] = []

  // PAGE 1: Application
  content.push(
    // Header with blue background
    {
      canvas: [
        {
          type: 'rect',
          x: -40,
          y: -40,
          w: 595.28,
          h: 110,
          color: '#2563EB',
        },
      ],
      margin: [0, 0, 0, 0] as [number, number, number, number],
    },
    {
      text: tr('header.title'),
      style: 'header',
      margin: [0, -100, 0, 5] as [number, number, number, number],
    },
    {
      text: tr('header.subtitle'),
      style: 'subheader',
      margin: [0, 0, 0, 3] as [number, number, number, number],
    },
    {
      text: currentDate,
      fontSize: 9,
      color: 'white',
      alignment: 'center',
      margin: [0, 0, 0, 40] as [number, number, number, number],
    },

    // Document 1 Header
    {
      text: tr('doc1.header'),
      style: 'sectionHeader',
      fillColor: '#F3F4F6',
      margin: [0, 0, 0, 10] as [number, number, number, number],
    },

    {
      text: tr('doc1.title'),
      style: 'documentTitle',
    },

    // Applicant Information
    {
      text: tr('doc1.applicantInfo'),
      style: 'fieldLabel',
    },
    {
      text: `${tr('doc1.fullName')}: ${formData.fullName}`,
      style: 'fieldValue',
    },
    {
      text: `${tr('doc1.personalCode')}: ${formData.personalCode}`,
      style: 'fieldValue',
    },
    {
      text: `${tr('doc1.address')}: ${formData.address}`,
      style: 'fieldValue',
    }
  )

  if (isApartment) {
    content.push({
      text: `${tr('doc1.apartmentNumber')}: ${formData.apartmentNumber}`,
      style: 'fieldValue',
    })
  }

  content.push(
    {
      text: `${tr('doc1.phone')}: ${formData.phone}`,
      style: 'fieldValue',
    },
    {
      text: `${tr('doc1.email')}: ${formData.email}`,
      style: 'fieldValue',
      margin: [0, 0, 0, 10] as [number, number, number, number],
    },

    // Request section
    {
      text: isApartment ? tr('doc1.requestApartment') : tr('doc1.requestHouse'),
      style: 'fieldLabel',
    },
    {
      text: isApartment
        ? tr('doc1.requestTextApartment', {
            spot: formData.parkingSpot || 'TBD',
            location: formData.parkingLocation,
          })
        : tr('doc1.requestTextHouse', { location: formData.parkingLocation }),
      style: 'fieldValue',
      margin: [0, 0, 0, 10] as [number, number, number, number],
    },

    // Charging station parameters
    {
      text: tr('doc1.parameters'),
      style: 'fieldLabel',
    },
    {
      ul: [
        `${tr('doc1.type')}: ${formData.chargerType}`,
        `${tr('doc1.power')}: ${formData.power} kW`,
        `${tr('doc1.connectors')}: ${formData.connectors}`,
        ...(formData.chargerModel ? [`${tr('doc1.model')}: ${formData.chargerModel}`] : []),
      ],
      style: 'listItem',
      margin: [0, 0, 0, 10] as [number, number, number, number],
    },

    // Commitments
    {
      text: tr('doc1.commitments'),
      style: 'fieldLabel',
    }
  )

  const commitments = [
    tr('doc1.commitment1'),
    tr('doc1.commitment2'),
    tr('doc1.commitment3'),
    tr('doc1.commitment4'),
  ]

  if (isApartment) {
    commitments.push(tr('doc1.commitment5'))
  }

  content.push(
    {
      ul: commitments,
      style: 'listItem',
      margin: [0, 0, 0, 15] as [number, number, number, number],
    },

    // Signature
    {
      text: `${tr('doc1.applicant')}: ___________________________`,
      margin: [0, 10, 0, 5] as [number, number, number, number],
    },
    {
      text: `(${formData.fullName})`,
      margin: [30, 0, 0, 5] as [number, number, number, number],
    },
    {
      text: `${tr('doc1.date')}: ${currentDate}`,
    }
  )

  // PAGE 2: Co-owner consent (if needed)
  if (needsCoOwnerDocs) {
    content.push(
      { text: '', pageBreak: 'after' },

      // Document 2 Header
      {
        text: tr('doc2.header'),
        style: 'sectionHeader',
        fillColor: '#F3F4F6',
        margin: [0, 0, 0, 10] as [number, number, number, number],
      },

      {
        text: tr('doc2.buildingTitle'),
        fontSize: 11,
        bold: true,
        alignment: 'center',
        margin: [0, 5, 0, 3] as [number, number, number, number],
      },
      {
        text: formData.address,
        fontSize: 11,
        alignment: 'center',
        margin: [0, 0, 0, 5] as [number, number, number, number],
      },
      {
        text: tr('doc2.consentTitle'),
        fontSize: 11,
        bold: true,
        alignment: 'center',
        margin: [0, 5, 0, 3] as [number, number, number, number],
      },
      {
        text: tr('doc2.consentSubtitle'),
        fontSize: 11,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10] as [number, number, number, number],
      },

      {
        text: tr('doc2.consentText', {
          name: formData.fullName,
          apt: formData.apartmentNumber,
          spot: formData.parkingSpot || 'TBD',
        }),
        margin: [0, 0, 0, 10] as [number, number, number, number],
      },

      // Parameters
      {
        text: tr('doc2.parameters'),
        style: 'fieldLabel',
      },
      {
        ul: [
          `${tr('doc2.power')}: ${formData.power} kW`,
          `${tr('doc2.type')}: ${formData.chargerType}`,
          `${tr('doc2.connectors')}: ${formData.connectors}`,
        ],
        style: 'listItem',
        margin: [0, 0, 0, 10] as [number, number, number, number],
      },

      // Conditions
      {
        text: tr('doc2.conditions'),
        style: 'fieldLabel',
      },
      {
        ol: [
          tr('doc2.condition1'),
          tr('doc2.condition2'),
          tr('doc2.condition3'),
          tr('doc2.condition4'),
          tr('doc2.condition5'),
        ],
        style: 'listItem',
        margin: [0, 0, 0, 10] as [number, number, number, number],
      },

      // Signature table
      {
        text: tr('doc2.signatureTable'),
        style: 'fieldLabel',
        margin: [0, 10, 0, 5] as [number, number, number, number],
      }
    )

    // Create signature table
    const tableBody: any[][] = [
      [
        { text: tr('doc2.tableHeaders.no'), bold: true, fillColor: '#E5E7EB', fontSize: 9 },
        { text: tr('doc2.tableHeaders.apt'), bold: true, fillColor: '#E5E7EB', fontSize: 9 },
        { text: tr('doc2.tableHeaders.name'), bold: true, fillColor: '#E5E7EB', fontSize: 9 },
        { text: tr('doc2.tableHeaders.code'), bold: true, fillColor: '#E5E7EB', fontSize: 9 },
        { text: tr('doc2.tableHeaders.signature'), bold: true, fillColor: '#E5E7EB', fontSize: 9 },
        { text: tr('doc2.tableHeaders.date'), bold: true, fillColor: '#E5E7EB', fontSize: 9 },
      ],
    ]

    // Add 10 empty rows
    for (let i = 0; i < 10; i++) {
      tableBody.push([
        { text: `${i + 1}.`, fontSize: 9 },
        { text: '', fontSize: 9 },
        { text: '', fontSize: 9 },
        { text: '', fontSize: 9 },
        { text: '', fontSize: 9 },
        { text: '', fontSize: 9 },
      ])
    }

    content.push(
      {
        table: {
          headerRows: 1,
          widths: [25, 40, 120, 80, 80, 55],
          body: tableBody,
        },
        layout: 'lightHorizontalLines',
        fontSize: 9,
        margin: [0, 0, 0, 10] as [number, number, number, number],
      },

      {
        text: tr('doc2.note'),
        style: 'note',
      }
    )
  }

  // PAGE 3: Instructions
  content.push(
    { text: '', pageBreak: 'after' },

    // Green header
    {
      canvas: [
        {
          type: 'rect',
          x: -40,
          y: -40,
          w: 595.28,
          h: 80,
          color: '#10B981',
        },
      ],
      margin: [0, 0, 0, 0] as [number, number, number, number],
    },
    {
      text: tr('doc3.header'),
      style: 'pageHeader',
      margin: [0, -70, 0, 40] as [number, number, number, number],
    }
  )

  let stepNum = 1

  // Step 1: Co-owner consents (if needed)
  if (needsCoOwnerDocs) {
    content.push({
      stack: [
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 515,
              h: 60,
              color: '#DBEAFE',
            },
            {
              type: 'ellipse',
              x: 12,
              y: 12,
              r1: 9,
              r2: 9,
              color: '#2563EB',
            },
          ],
        },
        {
          text: stepNum.toString(),
          color: 'white',
          bold: true,
          fontSize: 9,
          absolutePosition: { x: 48, y: 185 },
        },
        {
          text: tr('doc3.step1Title'),
          style: 'stepTitle',
          margin: [30, -50, 0, 3] as [number, number, number, number],
        },
        {
          text: tr('doc3.step1Text'),
          style: 'stepContent',
          margin: [30, 0, 5, 5] as [number, number, number, number],
        },
      ],
      margin: [0, 5, 0, 10] as [number, number, number, number],
    })
    stepNum++
  }

  // Step: Real Estate Register
  content.push({
    stack: [
      {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 515,
            h: 70,
            color: '#FEF3C7',
          },
          {
            type: 'ellipse',
            x: 12,
            y: 12,
            r1: 9,
            r2: 9,
            color: '#F59E0B',
          },
        ],
      },
      {
        text: stepNum.toString(),
        color: 'white',
        bold: true,
        fontSize: 9,
        absolutePosition: { x: 48, y: needsCoOwnerDocs ? 260 : 185 },
      },
      {
        text: tr('doc3.step2Title'),
        style: 'stepTitle',
        margin: [30, -60, 0, 3] as [number, number, number, number],
      },
      {
        text: tr('doc3.step2How'),
        bold: true,
        fontSize: 9,
        margin: [30, 0, 0, 2] as [number, number, number, number],
      },
      {
        ul: [tr('doc3.step2Online'), tr('doc3.step2Tel'), tr('doc3.step2Cost')],
        fontSize: 9,
        margin: [30, 0, 5, 5] as [number, number, number, number],
      },
    ],
    margin: [0, 5, 0, 10] as [number, number, number, number],
  })
  stepNum++

  // Step: ESO
  content.push({
    stack: [
      {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 515,
            h: 70,
            color: '#E0E7FF',
          },
          {
            type: 'ellipse',
            x: 12,
            y: 12,
            r1: 9,
            r2: 9,
            color: '#6366F1',
          },
        ],
      },
      {
        text: stepNum.toString(),
        color: 'white',
        bold: true,
        fontSize: 9,
        absolutePosition: { x: 48, y: needsCoOwnerDocs ? 345 : 270 },
      },
      {
        text: tr('doc3.step3Title'),
        style: 'stepTitle',
        margin: [30, -60, 0, 3] as [number, number, number, number],
      },
      {
        text: tr('doc3.step3How'),
        bold: true,
        fontSize: 9,
        margin: [30, 0, 0, 2] as [number, number, number, number],
      },
      {
        ul: [tr('doc3.step3Online'), tr('doc3.step3Tel'), tr('doc3.step3Cost')],
        fontSize: 9,
        margin: [30, 0, 5, 5] as [number, number, number, number],
      },
    ],
    margin: [0, 5, 0, 10] as [number, number, number, number],
  })
  stepNum++

  // Step: ENA Subsidy
  const subsidyPercentage = isApartment ? '60%' : '40%'
  const subsidyType = isApartment ? tr('doc3.step4Apartments') : tr('doc3.step4Houses')

  content.push({
    stack: [
      {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 515,
            h: 75,
            color: '#DCFCE7',
          },
          {
            type: 'ellipse',
            x: 12,
            y: 12,
            r1: 9,
            r2: 9,
            color: '#10B981',
          },
        ],
      },
      {
        text: stepNum.toString(),
        color: 'white',
        bold: true,
        fontSize: 9,
        absolutePosition: { x: 48, y: needsCoOwnerDocs ? 430 : 355 },
      },
      {
        text: tr('doc3.step4Title'),
        style: 'stepTitle',
        margin: [30, -65, 0, 3] as [number, number, number, number],
      },
      {
        text: tr('doc3.step4Subsidy'),
        bold: true,
        fontSize: 9,
        margin: [30, 0, 0, 2] as [number, number, number, number],
      },
      {
        text: tr('doc3.step4Amount', { type: subsidyType, percentage: subsidyPercentage }),
        fontSize: 9,
        margin: [30, 0, 0, 5] as [number, number, number, number],
      },
      {
        text: tr('doc3.step4Application'),
        bold: true,
        fontSize: 9,
        margin: [30, 0, 0, 5] as [number, number, number, number],
      },
      {
        text: tr('doc3.step4Important'),
        bold: true,
        color: '#DC2626',
        fontSize: 9,
        margin: [30, 0, 5, 5] as [number, number, number, number],
      },
    ],
    margin: [0, 5, 0, 10] as [number, number, number, number],
  })

  // Contacts box
  content.push({
    stack: [
      {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 515,
            h: 60,
            color: '#F9FAFB',
            lineColor: '#E5E7EB',
            lineWidth: 1,
          },
        ],
      },
      {
        text: tr('doc3.contactsTitle'),
        bold: true,
        fontSize: 10,
        margin: [5, -55, 0, 5] as [number, number, number, number],
      },
      {
        text: tr('doc3.contactENA'),
        fontSize: 9,
        margin: [5, 0, 0, 3] as [number, number, number, number],
      },
      {
        text: tr('doc3.contactESO'),
        fontSize: 9,
        margin: [5, 0, 0, 3] as [number, number, number, number],
      },
      {
        text: tr('doc3.contactRegistry'),
        fontSize: 9,
        margin: [5, 0, 0, 5] as [number, number, number, number],
      },
    ],
    margin: [0, 10, 0, 0] as [number, number, number, number],
  })

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10,
    },
    content: content,
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        color: 'white',
        alignment: 'center',
        margin: [0, 0, 0, 5] as [number, number, number, number],
      },
      subheader: {
        fontSize: 12,
        color: 'white',
        alignment: 'center',
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        background: '#F3F4F6',
        margin: [0, 10, 0, 10] as [number, number, number, number],
      },
      pageHeader: {
        fontSize: 16,
        bold: true,
        color: 'white',
        alignment: 'center',
        margin: [0, 0, 0, 0] as [number, number, number, number],
      },
      documentTitle: {
        fontSize: 11,
        bold: true,
        alignment: 'center',
        margin: [0, 10, 0, 10] as [number, number, number, number],
      },
      fieldLabel: {
        bold: true,
        margin: [0, 5, 0, 2] as [number, number, number, number],
      },
      fieldValue: {
        margin: [0, 0, 0, 5] as [number, number, number, number],
      },
      listItem: {
        margin: [5, 2, 0, 2] as [number, number, number, number],
      },
      note: {
        fontSize: 8,
        italics: true,
        margin: [0, 5, 0, 0] as [number, number, number, number],
      },
      stepBox: {
        margin: [0, 5, 0, 5] as [number, number, number, number],
      },
      stepTitle: {
        bold: true,
        fontSize: 10,
        margin: [5, 5, 0, 3] as [number, number, number, number],
      },
      stepContent: {
        fontSize: 9,
        margin: [5, 0, 5, 5] as [number, number, number, number],
      },
      contactBox: {
        fontSize: 9,
        margin: [2, 2, 2, 2] as [number, number, number, number],
      },
    },
  }

  // Generate and download PDF
  const pdfDocGenerator = pdfMake.createPdf(docDefinition)

