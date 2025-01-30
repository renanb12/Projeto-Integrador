import fs from 'fs';
import { DOMParser } from '@xmldom/xmldom';

export function parseXMLFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        
        // Extract NFe data
        const nfe = xmlDoc.getElementsByTagName('NFe')[0];
        const infNFe = nfe.getElementsByTagName('infNFe')[0];
        
        // Extract emit (supplier) data
        const emit = infNFe.getElementsByTagName('emit')[0];
        const supplier = {
          cnpj: getElementText(emit, 'CNPJ'),
          name: getElementText(emit, 'xNome'),
        };
        
        // Extract dest (recipient) data
        const dest = infNFe.getElementsByTagName('dest')[0];
        const recipient = {
          cnpj: getElementText(dest, 'CNPJ'),
          name: getElementText(dest, 'xNome'),
        };
        
        // Extract products
        const products = Array.from(infNFe.getElementsByTagName('det')).map(det => {
          const prod = det.getElementsByTagName('prod')[0];
          return {
            code: getElementText(prod, 'cProd'),
            name: getElementText(prod, 'xProd'),
            quantity: parseFloat(getElementText(prod, 'qCom')),
            price: parseFloat(getElementText(prod, 'vUnCom')),
            total: parseFloat(getElementText(prod, 'vProd')),
          };
        });
        
        // Extract general info
        const ide = infNFe.getElementsByTagName('ide')[0];
        const general = {
          number: getElementText(ide, 'nNF'),
          series: getElementText(ide, 'serie'),
          date: getElementText(ide, 'dhEmi'),
          type: getElementText(ide, 'tpNF'),
        };
        
        resolve({
          supplier,
          recipient,
          products,
          general,
          accessKey: infNFe.getAttribute('Id')?.replace('NFe', ''),
        });
      } catch (error) {
        reject(error);
      }
    });
  });
}

function getElementText(parent, tagName) {
  const element = parent.getElementsByTagName(tagName)[0];
  return element ? element.textContent : '';
}