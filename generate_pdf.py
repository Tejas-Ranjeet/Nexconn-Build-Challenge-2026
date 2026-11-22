import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_number(self, page_count):
        self.saveState()

        # Enclose the page/text with a crisp, professional black border
        self.setStrokeColor(colors.black)
        self.setLineWidth(1.2)
        # Page size: 612 x 792. Enclosing border with clean 24pt margins:
        self.rect(24, 18, 564, 756)

        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(40, 754, "Sahaay — Nexconn Build Challenge 2026 Project Write-Up")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(40, 747, 572, 747)
            
        # Footer (All pages)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(40, 44, 572, 44)
        
        footer_text = "Sahaay · Built for Nexconn Challenge 2026 · Team Lucario Wizards · App Key: z3v5yqkbzet40"
        self.drawString(40, 31, footer_text)
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(572, 31, page_str)
        self.restoreState()

def create_writeup_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=42,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()

    # Custom typography
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0f172a")
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#2563eb")
    )

    h1_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SubSectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#1e293b"),
        spaceBefore=4,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#334155")
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=body_style,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=2
    )

    meta_label = ParagraphStyle(
        'MetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#475569")
    )

    meta_val = ParagraphStyle(
        'MetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0f172a")
    )

    meta_val_blue = ParagraphStyle(
        'MetaValBlue',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#1d4ed8")
    )

    meta_val_code = ParagraphStyle(
        'MetaValCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#0f172a")
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#334155")
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0f172a")
    )

    story = []

    # Title & Subtitle Header
    story.append(Paragraph("Sahaay", title_style))
    story.append(Paragraph("Accessible Community Communication & Emergency Response Network", subtitle_style))
    story.append(Spacer(1, 6))

    # Executive Metadata Box
    meta_data = [
        [
            Paragraph("Challenge / Track:", meta_label),
            Paragraph("Nexconn Build Challenge 2026 — Chat SDK & Chat UI Track", table_cell),
            Paragraph("Application Key:", meta_label),
            Paragraph("z3v5yqkbzet40", meta_val_blue)
        ],
        [
            Paragraph("Team / Status:", meta_label),
            Paragraph("Lucario Wizards · Activated in Singapore Hub", table_cell),
            Paragraph("Data Center:", meta_label),
            Paragraph("api.sg-light-api.com (AreaCode.SG)", meta_val)
        ],
        [
            Paragraph("Live Deployment:", meta_label),
            Paragraph("https://nexconn-build-challenge-2026.vercel.app/", meta_val),
            Paragraph("Public Repository:", meta_label),
            Paragraph("github.com/Tejas-Ranjeet/Nexconn-Build-Challenge-2026", meta_val)
        ],
        [
            Paragraph("Demo Video:", meta_label),
            Paragraph("Google Drive Walkthrough Video (Accessible to Evaluators)", table_cell),
            Paragraph("SDK Packages:", meta_label),
            Paragraph("@nexconn/chat (v26.5.1), @nexconn/chatui (v26.5.0)", meta_val)
        ]
    ]

    t_meta = Table(meta_data, colWidths=[74, 184, 66, 208])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 8))

    # Section 1
    story.append(Paragraph("1. Executive Summary & Problem Solved", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb"), spaceAfter=5))
    
    p1 = ("During municipal crises, natural disasters, neighborhood power failures, and acute medical emergencies, "
          "conventional consumer messaging tools (such as WhatsApp groups, Telegram channels, and standard chat feeds) "
          "fail vulnerable populations across three critical dimensions:")
    story.append(Paragraph(p1, body_style))
    story.append(Spacer(1, 3))

    b1 = ("• <b>Physical & Cognitive Barriers:</b> Elderly residents, individuals with visual impairments, motor tremors, "
          "or limited digital literacy struggle with small mobile touch targets, poor contrast ratios, and manual on-screen typing.")
    b2 = ("• <b>Unmoderated Noise & Absence of Triage:</b> Urgent distress broadcasts are quickly buried under informal chatter, "
          "unverified rumors, and forwarded media, causing responders to miss time-critical signals.")
    b3 = ("• <b>Lack of Escalation to Verified Responders:</b> Distressed individuals have no direct, authenticated line to "
          "on-call medical practitioners or certified volunteer dispatchers.")
    story.append(Paragraph(b1, bullet_style))
    story.append(Paragraph(b2, bullet_style))
    story.append(Paragraph(b3, bullet_style))
    story.append(Spacer(1, 4))

    p2 = ("<b>Sahaay</b> (meaning <i>Support</i>) was created to solve this last-mile gap. Built natively on the "
          "<b>Nexconn Chat SDK and Chat UI</b>, Sahaay provides an accessible, noise-free mutual-aid platform with "
          "purpose-segregated emergency channels, 1:1 confidential responder lines, and an integrated accessibility engine "
          "(voice dictation, text-to-speech audio synthesis, high-contrast theming, and one-click GPS alert dispatch).")
    story.append(Paragraph(p2, body_style))
    story.append(Spacer(1, 8))

    # Section 2
    story.append(Paragraph("2. Nexconn Chat SDK & Chat UI Architecture", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb"), spaceAfter=5))

    p3 = ("Sahaay integrates the official Nexconn suite: <code>@nexconn/chat (v26.5.1)</code>, "
          "<code>@nexconn/chatui (v26.5.0)</code>, and <code>@nexconn/engine (v26.5.1)</code>. "
          "The implementation adheres to Nexconn's recommended security, connection, and data-flow patterns:")
    story.append(Paragraph(p3, body_style))
    story.append(Spacer(1, 4))

    sdk_features = [
        [
            Paragraph("Nexconn Component", table_cell_bold),
            Paragraph("SDK Class / Interface", table_cell_bold),
            Paragraph("Role & Technical Implementation in Sahaay", table_cell_bold)
        ],
        [
            Paragraph("<b>Community Triage Channels</b>", table_cell),
            Paragraph("<code>GroupChannelIdentifier</code><br/><code>GroupChannel.join()</code>", meta_val),
            Paragraph("Manages 5 structured emergency channels: <i>sahaay_emergency</i> (distress broadcasts), <i>sahaay_medical</i> (doctor consultations), <i>sahaay_volunteers</i> (field logistics), <i>sahaay_announcements</i> (advisories), and <i>sahaay_general</i> (elder checks).", table_cell)
        ],
        [
            Paragraph("<b>Direct 1:1 Consultation</b>", table_cell),
            Paragraph("<code>DirectChannelIdentifier</code><br/><code>DirectChannel.get()</code>", meta_val),
            Paragraph("Establishes confidential 1:1 lines between citizens in distress and designated physicians (Dr. Sunita) or volunteer leads, keeping private health details out of public channels.", table_cell)
        ],
        [
            Paragraph("<b>Ready-Made Chat UI Elements</b>", table_cell),
            Paragraph("<code>&lt;nc-chat-ui-app-provider&gt;</code><br/><code>NCChatUIApplication</code>", meta_val),
            Paragraph("Embeds Nexconn web components configured with dynamic <code>ServiceHooks</code> (<code>reqUserProfiles</code>, <code>reqGroupProfiles</code>, <code>reqGroupMembers</code>) to deliver live avatars, user badges, and member lists.", table_cell)
        ],
        [
            Paragraph("<b>Secure Server Token Minting</b>", table_cell),
            Paragraph("Next.js Server API Route<br/><code>/api/nexconn/token</code>", meta_val),
            Paragraph("Strict zero-leakage security: App Secret is kept on the server. Mints tokens via SHA-1 signature <code>SHA1(AppSecret + Nonce + Timestamp)</code> to the Singapore gateway (<code>api.sg-light-api.com</code>).", table_cell)
        ],
        [
            Paragraph("<b>Connection Event Lifecycle</b>", table_cell),
            Paragraph("<code>ConnectionStatusHandler</code><br/><code>ConnectionStatus</code>", meta_val),
            Paragraph("Pre-registers connection listeners before invoking connect. Automatically recovers from network dropouts and displays real-time connection badges to the user.", table_cell)
        ]
    ]

    t_sdk = Table(sdk_features, colWidths=[120, 140, 272])
    t_sdk.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_sdk)

    # PAGE BREAK TO PAGE 2
    story.append(PageBreak())

    # Page 2 Header Spacer (since running header appears at top)
    story.append(Spacer(1, 14))

    # Section 3
    story.append(Paragraph("3. Accessibility Suite & Core Differentiators (WCAG AAA)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb"), spaceAfter=5))

    p4 = ("Emergency messaging must be operable under extreme duress, low vision, and physical disability. "
          "Sahaay integrates five native accessibility layers directly alongside the Nexconn messaging core:")
    story.append(Paragraph(p4, body_style))
    story.append(Spacer(1, 4))

    a1 = ("• <b>Voice-to-Text Input (SpeechRecognition):</b> Powered by the browser Web Speech API. Injured, elderly, or "
          "mobility-impaired citizens can dictate distress messages without interacting with a virtual or physical keyboard.")
    a2 = ("• <b>Text-to-Speech Audio Playback (SpeechSynthesis):</b> Synthesizes and reads aloud incoming community announcements, "
          "physician replies, and volunteer updates, ensuring visually impaired or low-literacy users stay fully informed.")
    a3 = ("• <b>High-Contrast Mode (WCAG AAA Compliant):</b> Provides an immediate toggle to a high-contrast true black background "
          "(<code>#000000</code>) with vivid high-luminance elements (<code>#facc15</code>, <code>#38bdf8</code>), exceeding the 12:1 contrast ratio.")
    a4 = ("• <b>Dynamic Typography Scaling:</b> Supports instantaneous switching between Standard (100%), Large (125%), and Extra Large (150%) "
          "font sizes with enlarged touch targets (minimum 48×48px) designed to prevent mistaps.")
    a5 = ("• <b>One-Click Geolocation SOS Dispatch:</b> Automatically queries device GPS coordinates through HTML5 Geolocation and broadcasts "
          "a formatted, high-priority emergency card with latitude, longitude, and residential address to the responder channel.")
    story.append(Paragraph(a1, bullet_style))
    story.append(Paragraph(a2, bullet_style))
    story.append(Paragraph(a3, bullet_style))
    story.append(Paragraph(a4, bullet_style))
    story.append(Paragraph(a5, bullet_style))
    story.append(Spacer(1, 8))

    # Section 4
    story.append(Paragraph("4. Offline-First Resilience & Storage Layer", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb"), spaceAfter=5))

    p5 = ("In disaster environments where cellular connectivity fluctuates, messages must never disappear upon page reload or disconnect. "
          "Sahaay implements a dual-tier synchronization engine:")
    story.append(Paragraph(p5, body_style))
    story.append(Spacer(1, 3))

    r1 = ("• <b>Local Persistence:</b> Inbound and outbound Nexconn messages are immediately committed to browser <code>localStorage</code> "
          "keyed per channel (e.g. <code>sahaay_chat_sahaay_emergency</code>), guaranteeing complete chat history persistence.")
    r2 = ("• <b>Inter-Tab Synchrony:</b> A client-side <code>BroadcastChannel</code> bus propagates incoming Nexconn WebSocket frames "
          "across all open tabs in real time without creating duplicate socket connections or exceeding rate limits.")
    story.append(Paragraph(r1, bullet_style))
    story.append(Paragraph(r2, bullet_style))
    story.append(Spacer(1, 8))

    # Section 5
    story.append(Paragraph("5. Judging Verification & Submission Compliance Reference", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#2563eb"), spaceAfter=5))

    p6 = ("The following table provides the exact technical and compliance specifications required by the challenge judges:")
    story.append(Paragraph(p6, body_style))
    story.append(Spacer(1, 4))

    compliance_data = [
        [
            Paragraph("Item", table_cell_bold),
            Paragraph("Specification / Value", table_cell_bold),
            Paragraph("Verification Notes for Evaluators", table_cell_bold)
        ],
        [
            Paragraph("<b>Project Name</b>", table_cell),
            Paragraph("Sahaay (Accessible Community & Emergency Communication)", table_cell),
            Paragraph("Full-stack Next.js 16 application with Nexconn SDK integration.", table_cell)
        ],
        [
            Paragraph("<b>Nexconn App Key</b>", table_cell),
            Paragraph("<b>z3v5yqkbzet40</b>", meta_val_blue),
            Paragraph("Console Application Name: <i>Sahaay</i> (Status: Activated). Matches live deployment.", table_cell)
        ],
        [
            Paragraph("<b>Nexconn Gateway Hub</b>", table_cell),
            Paragraph("Singapore (api.sg-light-api.com)", meta_val),
            Paragraph("Configured with AreaCode.SG for ultra-low latency WebSocket routing.", table_cell)
        ],
        [
            Paragraph("<b>Nexconn Packages</b>", table_cell),
            Paragraph("Chat SDK (Required) & Chat UI (Checked)", meta_val),
            Paragraph("Both packages installed, bundled, and actively utilized in codebase.", table_cell)
        ],
        [
            Paragraph("<b>Live Deployment Link</b>", table_cell),
            Paragraph("https://nexconn-build-challenge-2026.vercel.app/", meta_val),
            Paragraph("Production HTTPS build on Vercel. Server token route active and verified.", table_cell)
        ],
        [
            Paragraph("<b>GitHub Repository</b>", table_cell),
            Paragraph("github.com/Tejas-Ranjeet/Nexconn-Build-Challenge-2026", meta_val),
            Paragraph("Public repository with full source code, deploy configs, and documentation.", table_cell)
        ],
        [
            Paragraph("<b>Prior Work Declaration</b>", table_cell),
            Paragraph("No, built exclusively for this challenge", table_cell_bold),
            Paragraph("100% fresh codebase created specifically for the Nexconn Hackathon 2026.", table_cell)
        ]
    ]

    t_comp = Table(compliance_data, colWidths=[105, 215, 212])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_comp)
    story.append(Spacer(1, 8))

    p_close = ("<b>Summary:</b> Sahaay demonstrates how real-time communication technology can safeguard lives when accessibility and "
               "purpose-driven architecture are prioritized. By uniting Nexconn's robust Chat SDK with voice accessibility and intelligent triage, "
               "Sahaay delivers a dependable lifeline for communities when they need it most.")
    story.append(Paragraph(p_close, body_style))

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated write-up PDF at: {output_path}")

if __name__ == "__main__":
    out_file = os.path.join(os.getcwd(), "Sahaay_Project_Writeup.pdf")
    create_writeup_pdf(out_file)
