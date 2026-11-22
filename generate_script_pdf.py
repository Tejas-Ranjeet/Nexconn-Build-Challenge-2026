import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class ScriptNumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(ScriptNumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(ScriptNumberedCanvas, self).showPage()
        super(ScriptNumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        # Enclosing black border
        self.setStrokeColor(colors.black)
        self.setLineWidth(1.2)
        self.rect(24, 18, 564, 756)

        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))

        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(40, 754, "Sahaay — Video Walkthrough Guide & Recording Script")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(40, 747, 572, 747)

        # Footer (All pages)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(40, 44, 572, 44)

        footer_text = "Sahaay Demo Script · Nexconn Build Challenge 2026 · App Key: z3v5yqkbzet40"
        self.drawString(40, 31, footer_text)
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(572, 31, page_str)
        self.restoreState()

def create_script_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=38,
        rightMargin=38,
        topMargin=42,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0f172a")
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#2563eb")
    )

    h1_style = ParagraphStyle(
        'H1Style',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor("#334155")
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#0f172a")
    )

    table_time = ParagraphStyle(
        'TableTime',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#2563eb")
    )

    table_action = ParagraphStyle(
        'TableAction',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#334155")
    )

    table_speech = ParagraphStyle(
        'TableSpeech',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0f172a")
    )

    callout_text = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1e293b")
    )

    story = []

    # Title
    story.append(Paragraph("Sahaay — Video Walkthrough Guide & Recording Script", title_style))
    story.append(Paragraph("2.5-Minute Presenter Script for Nexconn Build Challenge 2026", subtitle_style))
    story.append(Spacer(1, 5))

    # Quick presenter guide box
    guide_box = [
        [
            Paragraph("<b>Presenter Quick Setup (2 Minutes):</b><br/>"
                      "1. Open two browser windows side-by-side at: <code>https://nexconn-build-challenge-2026.vercel.app/</code><br/>"
                      "2. Left window = <b>Anita Devi (Citizen)</b>. Right window = <b>Arjun Patel (Volunteer)</b> or <b>Dr. Sunita</b>.<br/>"
                      "3. Use Loom, OBS, or Windows Game Bar (<code>Win+Alt+R</code>) to record. Read the spoken script while doing the actions.", callout_text)
        ]
    ]
    t_guide = Table(guide_box, colWidths=[536])
    t_guide.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_guide)
    story.append(Spacer(1, 6))

    story.append(Paragraph("Script & Screenplay (Read Spoken Words Aloud While Doing Actions)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb"), spaceAfter=4))

    script_rows = [
        [
            Paragraph("Timing", table_header),
            Paragraph("Action On Screen (What to Click)", table_header),
            Paragraph("Spoken Script (What to Say Out Loud)", table_header)
        ],
        [
            Paragraph("<b>0:00 - 0:20</b>", table_time),
            Paragraph("Show the clean Sahaay interface. Point mouse to header and app title.", table_action),
            Paragraph('"Hi everyone, this is Team Lucario Wizards, and today we’re presenting <b>Sahaay</b> — an accessible community communication and emergency response network built for the Nexconn Build Challenge 2026."', table_speech)
        ],
        [
            Paragraph("<b>0:20 - 0:40</b>", table_time),
            Paragraph("Hover over the left sidebar channels: Emergency, Medical, Volunteer.", table_action),
            Paragraph('"During crises, conventional apps like WhatsApp fail. Distress signals get drowned in chat noise, and senior citizens or injured individuals struggle with tiny keyboards. Sahaay solves this by combining Nexconn’s real-time messaging with dedicated crisis triage and WCAG AAA accessibility."', table_speech)
        ],
        [
            Paragraph("<b>0:40 - 1:05</b>", table_time),
            Paragraph("Point to the green <b>Connected</b> status badge and App Key in header.", table_action),
            Paragraph('"Sahaay is powered by the official <b>Nexconn Chat SDK</b> and <b>Nexconn Chat UI</b>, connected live to Nexconn’s Singapore data center under our verified App Key: <b>z3v5yqkbzet40</b>. We use Nexconn’s <code>GroupChannelIdentifier</code> to segregate emergency, medical, and relief channels."', table_speech)
        ],
        [
            Paragraph("<b>1:05 - 1:45</b>", table_time),
            Paragraph("Show two windows side-by-side.<br/>"
                      "Left: Anita sends <i>'Urgent: Need BP medication to Flat 302'</i>.<br/>"
                      "Watch it appear live on the right!<br/>"
                      "Right: Arjun replies <i>'Dispatching volunteer team now'</i>.", table_action),
            Paragraph('"Here we have two live browser sessions connected side-by-side. On the left, we have Anita Devi, a senior resident. On the right, we have Arjun Patel, our emergency first responder. When Anita posts an urgent request, it travels over Nexconn’s WebSocket protocol and instantly renders on Arjun’s screen without reloading. Arjun acknowledges immediately, providing instant reassurance."', table_speech)
        ],
        [
            Paragraph("<b>1:45 - 2:15</b>", table_time),
            Paragraph("1. Click <b>Microphone</b> icon (Voice Input).<br/>"
                      "2. Click <b>Listen</b> speaker icon on a message.<br/>"
                      "3. Toggle <b>High Contrast</b> (moon icon) and <b>Font Size (A+)</b>.", table_action),
            Paragraph('"Accessibility is central to Sahaay. For elderly residents who cannot type, we built native <b>Voice-to-Text input</b>. For visually impaired citizens, our <b>Text-to-Speech engine</b> reads aloud every incoming message. We also support instant high-contrast theming and dynamic font scaling exceeding WCAG AAA standards."', table_speech)
        ],
        [
            Paragraph("<b>2:15 - 2:40</b>", table_time),
            Paragraph("Click the red <b>SOS Alert</b> button in the header. Show GPS dialog, click <b>Send SOS</b>. Show red card appear live!", table_action),
            Paragraph('"In extreme emergencies, tapping the red <b>SOS Alert</b> button automatically captures GPS coordinates and broadcasts a high-priority distress card to all first responders. Sahaay shows how Nexconn technology can protect lives and build resilient communities. Thank you!"', table_speech)
        ]
    ]

    t_script = Table(script_rows, colWidths=[65, 175, 296])
    t_script.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_script)
    story.append(Spacer(1, 6))

    # After recording checklist box
    after_box = [
        [
            Paragraph("<b>After Recording — Upload Steps:</b><br/>"
                      "1. Save video as <code>Sahaay_Demo_Walkthrough.mp4</code> (or copy your Loom link).<br/>"
                      "2. Upload to the team Google Drive folder: <b>https://drive.google.com/drive/folders/1NHKl2p0NWWKTNUyq0RXqNzJ_iEvS8Q4Y</b><br/>"
                      "3. Ensure Drive permissions are set to: <b>Anyone with the link can view</b>.", callout_text)
        ]
    ]
    t_after = Table(after_box, colWidths=[536])
    t_after.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#eff6ff")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#93c5fd")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_after)

    doc.build(story, canvasmaker=ScriptNumberedCanvas)
    print(f"Generated script PDF: {output_path}")

if __name__ == "__main__":
    out_file = os.path.join(os.getcwd(), "Sahaay_Video_Script_Guide.pdf")
    create_script_pdf(out_file)
