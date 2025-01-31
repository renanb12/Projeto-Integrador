export async function parseXMLFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(e.target?.result as string, "text/xml");
        
        // Extract NFe data
        const nfe = xmlDoc.getElementsByTagName('NFe')[0];
        const infNFe = nfe.getElementsByTagName('infNFe')[0];
        
        // Extract emit (supplier) data
        const emit = infNFe.getElementsByTagName('emit')[0];
        const supplier = {
          cnpj: emit.getElementsByTagName('CNPJ')[0]?.textContent,
          name: emit.getElementsByTagName('xNome')[0]?.textContent,
        };
        
        // Extract dest (recipient) data
        const dest = infNFe.getElementsByTagName('dest')[0];
        const recipient = {
          cnpj: dest.getElementsByTagName('CNPJ')[0]?.textContent,
          name: dest.getElementsByTagName('xNome')[0]?.textContent,
        };
        
        // Extract products
        const products = Array.from(infNFe.getElementsByTagName('det')).map(det => {
          const prod = det.getElementsByTagName('prod')[0];
          return {
            code: prod.getElementsByTagName('cProd')[0]?.textContent,
            name: prod.getElementsByTagName('xProd')[0]?.textContent,
            quantity: prod.getElementsByTagName('qCom')[0]?.textContent,
            price: prod.getElementsByTagName('vUnCom')[0]?.textContent,
            total: prod.getElementsByTagName('vProd')[0]?.textContent,
          };
        });
        
        // Extract general info
        const ide = infNFe.getElementsByTagName('ide')[0];
        const general = {
          number: ide.getElementsByTagName('nNF')[0]?.textContent,
          series: ide.getElementsByTagName('serie')[0]?.textContent,
          date: ide.getElementsByTagName('dhEmi')[0]?.textContent,
          type: ide.getElementsByTagName('tpNF')[0]?.textContent,
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
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}