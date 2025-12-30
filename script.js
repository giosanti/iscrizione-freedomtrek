// Inizializza EmailJS
(function() {
    try {
        emailjs.init('Hie4bGv1yyKAJ-DVx');
        console.log('EmailJS inizializzato correttamente');
    } catch(err) {
        console.error('Errore inizializzazione EmailJS:', err);
    }
})();

document.getElementById('iscrizioneForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Raccogli tutti i dati dal form
    const nome_cognome = document.getElementById('nome_cognome').value;
    const luogo_nascita = document.getElementById('luogo_nascita').value;
    const provincia_nascita = document.getElementById('provincia_nascita').value;
    const data_nascita = document.getElementById('data_nascita').value;
    const codice_fiscale = document.getElementById('codice_fiscale').value;
    const indirizzo = document.getElementById('indirizzo').value;
    const numero_civico = document.getElementById('numero_civico').value;
    const citta = document.getElementById('citta').value;
    const provincia = document.getElementById('provincia').value;
    const cap = document.getElementById('cap').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const pagamento = document.getElementById('pagamento').value;
    const privacy1 = document.getElementById('privacy1').checked ? 'Sì' : 'No';
    const privacy2 = document.getElementById('privacy2').checked ? 'Sì' : 'No';
    

        // Carica il logo come base64 e genera il PDF solo dopo il caricamento
        const reader = new FileReader();
        fetch('./logo.png')
            .then(response => response.blob())
            .then(blob => {
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    const logoBase64 = reader.result;
                    generaPDF(logoBase64);
                };
            })
            .catch(() => {
                // Se il logo non viene caricato, genera comunque il PDF senza logo
                generaPDF(null);
            });

        function generaPDF(logoBase64) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const marginX = 20;
    let y = 20;

    // Funzione per convertire data in formato europeo
    const formatDataEuropea = (dataIso) => {
        if (!dataIso) return '';
        const [anno, mese, giorno] = dataIso.split('-');
        return `${giorno}/${mese}/${anno}`;
    };

    // Converti la data in formato europeo
    const data_nascita_formattata = formatDataEuropea(data_nascita);

    // --- 1. TITOLO PRINCIPALE ---
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("DOMANDA DI AMMISSIONE A SOCIO", 105, y, { align: "center" });
    
    y += 10; // Spazio tra titolo e logo

    // --- 2. LOGO (CERCHIO PERFETTO) ---
    // Impostando larghezza e altezza uguali (es. 40, 40) forziamo la forma quadrata
    const logoSize = 40; 
    if (logoBase64) {
        const logoX = (210 - logoSize) / 2; // Centratura orizzontale
        try {
            // Usiamo logoSize sia per larghezza che per altezza
            doc.addImage(logoBase64, 'PNG', logoX, y, logoSize, logoSize);
        } catch (e) {
            try {
                doc.addImage(logoBase64, 'JPEG', logoX, y, logoSize, logoSize);
            } catch (e2) {
                console.error("Impossibile caricare il logo");
            }
        }
        y += logoSize + 10; // Sposta y sotto il logo
    } else {
        y += 10;
    }

    // --- 3. SOTTO-TITOLI ---
    doc.setFontSize(14);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("SEDE LEGALE: Montesilvano, VIA Piceni N° 7", 105, y, { align: "center" });
y += 15; // Spazio prima di "Il sottoscritto..."
            // --- DATI ANAGRAFICI ---
            const lineSpacing = 8;
            doc.text(`Il/La sottoscritto/a: ${nome_cognome}`, marginX, y);
            y += lineSpacing;
            doc.text(`nato/a a: ${luogo_nascita} il: ${data_nascita_formattata} Prov: ${provincia_nascita}`, marginX, y);
            y += lineSpacing;
            doc.text(`C.F.: ${codice_fiscale}`, marginX, y);
            y += lineSpacing;
            doc.text(`Residente in: ${citta} Prov: ${provincia}`, marginX, y);
            y += lineSpacing;
            doc.text(`Via/Corso/Piazza: ${indirizzo} n. ${numero_civico}`, marginX, y);
            y += lineSpacing;
            doc.text(`CAP: ${cap} Tel: ${telefono} E-mail: ${email}`, marginX, y);

            y += 15;
            doc.setFont("helvetica", "bold");
            doc.text("Chiede di essere ammesso quale socio dell'Associazione.", marginX, y);
            y += 10;
            doc.setFont("helvetica", "normal");
            const impegno = "Il sottoscritto si impegna a rispettare le disposizioni statutarie vigenti e le delibere degli organi sociali validamente costituiti. A tale scopo dichiara di conoscere e accettare lo statuto sociale.";
            doc.text(doc.splitTextToSize(impegno, 170), marginX, y);
            y += 15;
            // Il simbolo € non è supportato da tutti i font jsPDF base, uso EUR come fallback
            doc.text("Mi impegno al versamento delle quote sociali nella misura di EUR 25/annui.", marginX, y);
            y += 7;
            doc.setFontSize(9);
            doc.text("La quota potrà essere corrisposta in contanti, paypal o bonifico bancario (PREFERITO).", marginX, y);

            y += 15;
            doc.setFontSize(10);
            doc.text("Data e luogo: ____________________  Firma: __________________________", marginX, y);

            y += 15;
            doc.setDrawColor(200);
            doc.rect(marginX - 5, y - 5, 180, 25);
            doc.setFont("helvetica", "bold");
            doc.text("Estremi Bonifico Bancario", marginX, y);
            y += 7;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.text("IBAN: IT48U3608105138298899598914", marginX, y);
            y += 5;
            doc.text("CAUSALE: Tesseramento 'anno' + Nome e Cognome associato", marginX, y);
            y += 5;
            doc.text("BENEFICIARIO: Yuri Gozzini (Segretario e Tesoriere associazione)", marginX, y);

            y += 20;
            doc.setFont("helvetica", "bold");
            doc.text("INFORMATIVA PER IL TRATTAMENTO DEI DATI PERSONALI", marginX, y);
            y += 7;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            const privacy = "Ricevuta l'informativa sull'utilizzazione dei miei dati personali ai sensi dell'art. 13 del D.Lgs 196/2003 e del GDPR Regolamento (UE) 2016/679, consento al loro trattamento nella misura necessaria per il perseguimento degli scopi statutari.";
            doc.text(doc.splitTextToSize(privacy, 170), marginX, y);

            y += 20;
            doc.setFontSize(10);
            doc.text("Luogo e data: ____________________  Firma: __________________________", marginX, y);

            y += 15;
            doc.setFont("helvetica", "italic");
            doc.text("Inviare compilato a: freedomtrekaps23@gmail.com", 105, y, { align: "center" });

            // Salva e scarica il PDF
            doc.save("Domanda_Ammissione_Freedomtrek.pdf");

            // Invia email con JotForm
            const formData = new FormData();
            formData.append('nome_cognome', nome_cognome);
            formData.append('luogo_nascita', luogo_nascita);
            formData.append('provincia_nascita', provincia_nascita);
            formData.append('data_nascita', data_nascita);
            formData.append('codice_fiscale', codice_fiscale);
            formData.append('indirizzo', indirizzo);
            formData.append('numero_civico', numero_civico);
            formData.append('citta', citta);
            formData.append('provincia', provincia);
            formData.append('cap', cap);
            formData.append('telefono', telefono);
            formData.append('email', email);
            formData.append('pagamento', pagamento);
            formData.append('privacy1', privacy1);
            formData.append('privacy2', privacy2);

            console.log('Invio email con JotForm...');

            fetch('https://submit.jotform.com/submit/253632103874051/', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log('✅ Form inviato con successo:', data);
                document.getElementById('successo').style.display = 'block';
                document.getElementById('errore').style.display = 'none';
            })
            .catch(error => {
                console.error('❌ Errore invio form:', error);
                document.getElementById('successo').style.display = 'none';
                document.getElementById('errore').style.display = 'block';
                document.getElementById('errore').innerHTML = '<p>Errore: ' + error.message + '</p>';
            });
        }

});
