#!/usr/bin/env python3
"""
Generate PDF from HTML speaker one-sheet.
This script tries multiple methods to generate a PDF.
"""

import subprocess
import sys
import os

def try_wkhtmltopdf():
    """Try using wkhtmltopdf if available."""
    try:
        subprocess.run(['wkhtmltopdf', '--version'], capture_output=True, check=True)
        print("✓ Using wkhtmltopdf")
        subprocess.run([
            'wkhtmltopdf',
            '--page-size', 'Letter',
            '--margin-top', '10mm',
            '--margin-bottom', '10mm',
            '--margin-left', '10mm',
            '--margin-right', '10mm',
            'speaker-one-sheet.html',
            'src/img/speaking/tanner-byers-speaker-one-sheet.pdf'
        ], check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def try_weasyprint():
    """Try using WeasyPrint if available."""
    try:
        from weasyprint import HTML
        print("✓ Using WeasyPrint")
        HTML('speaker-one-sheet.html').write_pdf('src/img/speaking/tanner-byers-speaker-one-sheet.pdf')
        return True
    except ImportError:
        return False

def try_playwright():
    """Try using Playwright if available."""
    try:
        from playwright.sync_api import sync_playwright
        print("✓ Using Playwright")
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.goto(f'file://{os.path.abspath("speaker-one-sheet.html")}')
            page.pdf(path='src/img/speaking/tanner-byers-speaker-one-sheet.pdf', format='Letter')
            browser.close()
        return True
    except ImportError:
        return False

def instructions():
    """Print manual instructions."""
    print("\n" + "="*60)
    print("MANUAL PDF GENERATION REQUIRED")
    print("="*60)
    print("\nNo automated PDF tools found on this system.")
    print("\nTo generate the PDF manually:")
    print("1. Open speaker-one-sheet.html in your browser")
    print("2. Press Cmd+P (or File > Print)")
    print("3. Select 'Save as PDF'")
    print("4. Save to: src/img/speaking/tanner-byers-speaker-one-sheet.pdf")
    print("\nAlternatively, install one of these tools:")
    print("  • brew install wkhtmltopdf")
    print("  • pip3 install weasyprint")
    print("  • pip3 install playwright && playwright install chromium")
    print("="*60 + "\n")

def main():
    print("Attempting to generate PDF from HTML...\n")
    
    methods = [
        ("wkhtmltopdf", try_wkhtmltopdf),
        ("WeasyPrint", try_weasyprint),
        ("Playwright", try_playwright)
    ]
    
    for name, method in methods:
        print(f"Trying {name}...", end=" ")
        if method():
            print(f"\n✓ PDF generated successfully at: src/img/speaking/tanner-byers-speaker-one-sheet.pdf")
            return 0
        print("not available")
    
    instructions()
    return 1

if __name__ == '__main__':
    sys.exit(main())
