// ============================================================
// ASSESSORIA VITTUS — Google Apps Script
// Recebe dados do formulário e organiza a planilha
// ============================================================

// ======================
// 1) CONFIGURAÇÃO INICIAL — Execute esta função UMA VEZ
// ======================
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  // Renomear a aba
  sheet.setName('Leads Vittus');

  // Renomear a planilha
  ss.rename('VITTUS — CRM de Leads');

  // Limpar tudo
  sheet.clear();

  // ===== CABEÇALHOS =====
  var headers = [
    'Data/Hora',
    'Nome Completo',
    'E-mail',
    'Telefone',
    'Empresa',
    'CNPJ',
    'Segmento',
    'Faturamento Mensal',
    'Orçamento Disponível',
    'Status'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // ===== FORMATAÇÃO DO CABEÇALHO =====
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontFamily('Inter');
  headerRange.setFontSize(10);
  headerRange.setFontWeight('bold');
  headerRange.setFontColor('#ffffff');
  headerRange.setBackground('#0f0f1a');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  headerRange.setWrap(true);
  headerRange.setBorder(true, true, true, true, false, false, '#2a2a4a', SpreadsheetApp.BorderStyle.SOLID);

  // Altura do cabeçalho
  sheet.setRowHeight(1, 45);

  // ===== LARGURA DAS COLUNAS =====
  sheet.setColumnWidth(1, 160);   // Data/Hora
  sheet.setColumnWidth(2, 200);   // Nome
  sheet.setColumnWidth(3, 240);   // E-mail
  sheet.setColumnWidth(4, 160);   // Telefone
  sheet.setColumnWidth(5, 200);   // Empresa
  sheet.setColumnWidth(6, 180);   // CNPJ
  sheet.setColumnWidth(7, 180);   // Segmento
  sheet.setColumnWidth(8, 200);   // Faturamento
  sheet.setColumnWidth(9, 220);   // Orçamento
  sheet.setColumnWidth(10, 140);  // Status

  // ===== CONGELAR CABEÇALHO =====
  sheet.setFrozenRows(1);

  // ===== FORMATAÇÃO PADRÃO DAS CÉLULAS DE DADOS =====
  var dataRange = sheet.getRange(2, 1, 998, headers.length);
  dataRange.setFontFamily('Inter');
  dataRange.setFontSize(10);
  dataRange.setVerticalAlignment('middle');
  dataRange.setWrap(true);
  dataRange.setFontColor('#1a1a2e');

  // Altura padrão das linhas de dados
  for (var i = 2; i <= 50; i++) {
    sheet.setRowHeight(i, 36);
  }

  // ===== VALIDAÇÃO DA COLUNA "STATUS" (J) =====
  var statusRange = sheet.getRange(2, 10, 998, 1);
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      '🟡 Novo Lead',
      '🔵 Em Contato',
      '🟠 Negociando',
      '🟢 Fechado',
      '🔴 Perdido',
      '⚪ Sem Resposta'
    ], true)
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(statusRule);

  // ===== FORMATAÇÃO CONDICIONAL — STATUS =====
  var rules = sheet.getConditionalFormatRules();

  // Novo Lead — amarelo claro
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Novo Lead')
    .setBackground('#fff9c4')
    .setFontColor('#f57f17')
    .setRanges([statusRange])
    .build());

  // Em Contato — azul claro
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Em Contato')
    .setBackground('#e3f2fd')
    .setFontColor('#1565c0')
    .setRanges([statusRange])
    .build());

  // Negociando — laranja claro
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Negociando')
    .setBackground('#fff3e0')
    .setFontColor('#e65100')
    .setRanges([statusRange])
    .build());

  // Fechado — verde claro
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Fechado')
    .setBackground('#e8f5e9')
    .setFontColor('#2e7d32')
    .setRanges([statusRange])
    .build());

  // Perdido — vermelho claro
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Perdido')
    .setBackground('#ffebee')
    .setFontColor('#c62828')
    .setRanges([statusRange])
    .build());

  // Sem Resposta — cinza
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Sem Resposta')
    .setBackground('#f5f5f5')
    .setFontColor('#757575')
    .setRanges([statusRange])
    .build());

  sheet.setConditionalFormatRules(rules);

  // ===== FORMATAÇÃO ALTERNADA NAS LINHAS =====
  var bandingRange = sheet.getRange(1, 1, 50, headers.length);
  try {
    bandingRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
  } catch(e) {
    // Banding já aplicado, ignorar
  }

  // ===== PROTEÇÃO DO CABEÇALHO =====
  var protection = sheet.getRange(1, 1, 1, headers.length).protect();
  protection.setDescription('Cabeçalho protegido');
  protection.setWarningOnly(true);

  // ===== FILTRO AUTOMÁTICO =====
  var filterRange = sheet.getRange(1, 1, sheet.getMaxRows(), headers.length);
  try {
    filterRange.createFilter();
  } catch(e) {
    // Filtro já existe
  }

  // Mensagem de sucesso
  SpreadsheetApp.getUi().alert(
    '✅ Planilha configurada com sucesso!\n\n' +
    '• Cabeçalhos profissionais criados\n' +
    '• Coluna de Status com dropdown e cores\n' +
    '• Filtros automáticos ativados\n' +
    '• Formatação condicional aplicada\n\n' +
    'Os dados do formulário do site serão preenchidos automaticamente.'
  );
}

// ======================
// 2) RECEBER DADOS DO FORMULÁRIO
// ======================
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Leads Vittus') || ss.getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Se a planilha estiver vazia, roda o setup primeiro
    if (sheet.getLastRow() === 0) {
      setupSheet();
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
      data.investimento || '',
      '🟡 Novo Lead'
    ]);

    // Formatar a última linha adicionada
    var lastRow = sheet.getLastRow();
    var newRowRange = sheet.getRange(lastRow, 1, 1, 10);
    newRowRange.setFontFamily('Inter');
    newRowRange.setFontSize(10);
    newRowRange.setVerticalAlignment('middle');
    sheet.setRowHeight(lastRow, 36);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ======================
// 3) HEALTH CHECK
// ======================
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Vittus Form Handler ativo' }))
    .setMimeType(ContentService.MimeType.JSON);
}
