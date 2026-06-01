// ============================================================
// ASSESSORIA VITTUS — Google Apps Script
// Cole este código em: Extensões > Apps Script na sua planilha
// ============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Se a planilha estiver vazia, cria os cabeçalhos
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Data/Hora',
        'Nome',
        'E-mail',
        'Telefone',
        'Empresa',
        'CNPJ',
        'Segmento',
        'Faturamento',
        'Investimento'
      ]);

      // Formata os cabeçalhos
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1a1a2e');
      headerRange.setFontColor('#ffffff');
    }

    // Adiciona a linha com os dados
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('pt-BR'),
      data.nome || '',
      data.email || '',
      data.telefone || '',
      data.empresa || '',
      data.cnpj || '',
      data.segmento || '',
      data.faturamento || '',
      data.investimento || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Vittus Form Handler ativo' }))
    .setMimeType(ContentService.MimeType.JSON);
}
