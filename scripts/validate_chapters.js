import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/chapters.ts');

try {
  let rawData = fs.readFileSync(filePath);
  let decodedStr = rawData.toString('utf8');
  
  console.log(`Analyzing file for corruptions/encodings: ${filePath}`);
  console.log(`File size: ${rawData.length} bytes`);
  
  const checkIssues = (str) => {
    const findings = [];
    // 1. Look for Replacement Characters (\uFFFD) which indicate UTF-8 decode issues
    let searchIdx = str.indexOf('\uFFFD');
    while (searchIdx !== -1) {
      const lineNum = str.substring(0, searchIdx).split('\n').length;
      findings.push({
        type: 'INVALID_UTF8_REPLACEMENT_CHAR',
        index: searchIdx,
        line: lineNum,
        snippet: str.substring(Math.max(0, searchIdx - 20), Math.min(str.length, searchIdx + 20)).replace(/\r?\n/g, ' ')
      });
      searchIdx = str.indexOf('\uFFFD', searchIdx + 1);
    }
    
    // 2. Check for unexpected low non-printable ASCII control characters (excluding \n, \r, \t)
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code < 32 && code !== 10 && code !== 13 && code !== 9) {
        const lineNum = str.substring(0, i).split('\n').length;
        findings.push({
          type: 'CONTROL_CHARACTER',
          code: code,
          line: lineNum,
          index: i,
          snippet: str.substring(Math.max(0, i - 15), Math.min(str.length, i + 15)).replace(/\r?\n/g, ' ')
        });
      }
    }
    return findings;
  };

  let issues = checkIssues(decodedStr);

  if (issues.length > 0) {
    console.warn(`⚠️ Found ${issues.length} encoding or corruption issue(s). Initiating automatic repair...`);
    
    // Automatic cleanup:
    // A: Strip replacement character \uFFFD
    let repairedStr = decodedStr.replace(/\uFFFD/g, '');
    
    // B: Strip low control characters except tab (9), lf (10), cr (13)
    let finalCleanedStr = '';
    for (let i = 0; i < repairedStr.length; i++) {
      const code = repairedStr.charCodeAt(i);
      if (code < 32 && code !== 10 && code !== 13 && code !== 9) {
        // Skip it
        continue;
      }
      finalCleanedStr += repairedStr[i];
    }
    
    // Write repaired file back to chapters.ts
    fs.writeFileSync(filePath, finalCleanedStr, 'utf8');
    console.log(`✨ Reparation completed. File rewritten successfully!`);
    
    // Verify the repaired file content
    const verifyStr = fs.readFileSync(filePath, 'utf8');
    const remainingIssues = checkIssues(verifyStr);
    if (remainingIssues.length > 0) {
      console.error(`❌ Validation failed even after automatic repair. Remaining issues:`, remainingIssues);
      process.exit(1);
    } else {
      console.log(`✅ Repair verification passed! All corrupt bytes and control characters stripped.`);
      process.exit(0);
    }
  } else {
    console.log('✅ Validation passed! The file contains no corrupt bytes or invalid control characters.');
    process.exit(0);
  }
} catch (error) {
  console.error('❌ Error executing validate/repair chapters script:', error);
  process.exit(1);
}
