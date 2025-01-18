type EndcardInfo = {
    paintings: {
        name: string,
        damages: number,
    }[],
};

export function showEndcard(info: EndcardInfo) {
    const totalDamages = info.paintings.reduce((sum, painting) => sum + painting.damages, 0);
    const reportDate = new Date().toLocaleDateString('en-GB');

    const root = document.createElement('div');
    document.body.appendChild(root);
    root.innerHTML = `
        <div class="damage-report">
            <header class="report-header">
                <h1>Damage Report</h1>
                <p class="report-date">Date: ${reportDate}</p>
                <p class="report-ref">Reference: MDR-${Date.now().toString().slice(-6)}</p>
            </header>

            <section class="report-content">
                <h2>Damaged Artworks</h2>
                <table class="damage-table">
                    <thead>
                        <tr>
                            <th>Artwork</th>
                            <th>Estimated Damage (EUR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${info.paintings.map(painting => `
                            <tr>
                                <td>${painting.name}</td>
                                <td class="damage-amount">€${painting.damages.toLocaleString('de-DE')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="total-damages">
                    <p>Total Estimated Damages: <strong>€${totalDamages.toLocaleString('de-DE')}</strong></p>
                </div>
            </section>

            <section class="signatures">
                <div class="signature-block">
                    <div class="signature-line"></div>
                    <p>Dr. Isabella von Kunstmann</p>
                    <p class="title">Museum Director</p>
                </div>
                <div class="signature-block">
                    <div class="signature-line"></div>
                    <p>Marcus Weber</p>
                    <p class="title">Head of Security</p>
                </div>
            </section>

            <footer class="report-footer">
                <p>This report was generated automatically following the incident.</p>
                <p>National Museum of Fine Arts</p>
            </footer>
        </div>

        <style>
            .damage-report {
                position: absolute;
                max-width: 800px;
                margin: 2rem auto;
                padding: 2rem;
                background: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                font-family: 'Times New Roman', serif;
            }

            .report-header {
                text-align: center;
                border-bottom: 2px solid #000;
                padding-bottom: 1rem;
                margin-bottom: 2rem;
            }

            .report-header h1 {
                margin: 0 0 1rem;
                font-size: 2rem;
            }

            .report-date, .report-ref {
                margin: 0.5rem 0;
                font-size: 1.1rem;
            }

            .damage-table {
                width: 100%;
                border-collapse: collapse;
                margin: 2rem 0;
            }

            .damage-table th, .damage-table td {
                padding: 0.75rem;
                border-bottom: 1px solid #ccc;
                text-align: left;
            }

            .damage-table th {
                border-bottom: 2px solid #000;
            }

            .damage-amount {
                text-align: right;
            }

            .total-damages {
                text-align: right;
                font-size: 1.2rem;
                margin: 2rem 0;
                padding: 1rem 0;
                border-top: 2px solid #000;
            }

            .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 4rem;
                padding: 0 2rem;
            }

            .signature-block {
                text-align: center;
                width: 40%;
            }

            .signature-line {
                width: 100%;
                height: 1px;
                background: #000;
                margin-bottom: 1rem;
            }

            .signature-block .title {
                margin-top: 0.25rem;
                font-style: italic;
                color: #666;
            }

            .report-footer {
                margin-top: 4rem;
                text-align: center;
                font-size: 0.9rem;
                color: #666;
            }
        </style>
    `;
}
