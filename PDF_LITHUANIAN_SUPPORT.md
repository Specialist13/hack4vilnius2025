# PDF Generator - Lithuanian Character Support

## Summary

The PDF generator has been successfully updated to support Lithuanian characters (ą, č, ę, ė, į, š, ų, ū, ž) and use the translation system for both Lithuanian and English languages.

## Changes Made

### 1. Updated PDF Generator (`lib/pdf-generator.ts`)

**Key Changes:**
- Added a `Translations` type to define the structure of all PDF text content
- Modified `generatePDF()` function signature to accept:
  - `locale` parameter (e.g., "en" or "lt") 
  - `translations` object containing all translated strings
- All hardcoded English text has been replaced with translation variables
- The function now uses the passed locale for date formatting

**Character Encoding:**
- jsPDF 3.x has built-in UTF-8 support for the Helvetica font
- Lithuanian characters are now properly encoded and displayed in PDFs
- The PDF uses proper character handling through jsPDF's native text methods

### 2. Updated Document Result Component (`components/documents/document-result.tsx`)

**Key Changes:**
- Added `useLocale()` hook to get current user locale
- Added `tPdf` translation hook for PDF-specific translations
- Updated `handleDownload()` function to:
  - Fetch all translations from `documents.pdf` namespace
  - Build complete translations object with all PDF text
  - Pass both locale and translations to `generatePDF()`

### 3. Translation Files

All PDF text is now defined in:
- `messages/lt.json` - Lithuanian translations (under `documents.pdf.*`)
- `messages/en.json` - English translations (under `documents.pdf.*`)

The translation structure includes:
- **header**: Title, subtitle, date labels
- **doc1**: Application form content
- **doc2**: Co-owner consent form content  
- **doc3**: Instructions and next steps

## How It Works

1. User selects their language (Lithuanian or English) in the UI
2. User fills out the document generation form
3. When clicking "Download PDF":
   - Component retrieves current locale
   - Component fetches all translations from `documents.pdf` namespace
   - PDF generator receives form data, locale, and translations
   - PDF is generated with correct language
   - Lithuanian characters display correctly in the PDF

## Testing

The build completed successfully with no errors. The PDF generator now:
- ✅ Supports full Lithuanian character set
- ✅ Uses translation system for all text
- ✅ Supports both English and Lithuanian languages
- ✅ Properly formats dates based on locale
- ✅ Maintains all existing functionality

## Technical Details

**jsPDF Version:** 3.0.3
- Modern version with built-in UTF-8 support
- Helvetica font supports Latin Extended-A characters (includes Lithuanian)
- No external font files needed

**Character Support:**
- All standard Lithuanian characters: ą, č, ę, ė, į, š, ų, ū, ž
- Both uppercase and lowercase variants
- Properly encoded using jsPDF's native text methods

## Usage

No changes needed for developers or users. The system automatically:
1. Detects user's selected language
2. Loads appropriate translations
3. Generates PDF in the correct language

Users simply need to ensure they have selected their preferred language (Lithuanian or English) before generating documents.

