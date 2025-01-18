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
                        ${info.paintings
                            .map(
                                (painting) => `
                            <tr>
                                <td>${painting.name}</td>
                                <td class="damage-amount">€${painting.damages.toLocaleString("de-DE")}</td>
                            </tr>
                        `,
                            )
                            .join("")}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td><strong>Total Damages</strong></td>
                            <td class="damage-amount"><strong>€${totalDamages.toLocaleString("de-DE")}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </section>

            <section class="signatures">
                <div class="signature-block">
                    <p>Dr. Isabella von Kunstmann</p>
                    <p class="title">Museum Director</p>
                </div>
                <div class="signature-block">
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
                border: 1px solid #ccc;
                text-align: left;
            }

            .damage-table th {
                background: #f5f5f5;
            }

            .damage-amount {
                text-align: right;
            }

            .signatures {
                display: flex;
                justify-content: space-around;
                margin-top: 4rem;
            }

            .signature-block {
                text-align: center;
                border-top: 1px solid #000;
                padding-top: 0.5rem;
                width: 200px;
            }

            .signature-block p {
                margin: 0;
            }

            .title {
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
