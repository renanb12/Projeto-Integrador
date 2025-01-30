import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { parseXMLFile } from '../../utils/xmlParser';

interface EntryFormProps {
  onClose: () => void;
  onSave: () => void;
}

export function EntryForm({ onClose, onSave }: EntryFormProps) {
  const [xmlFile, setXMLFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError('');
      setXMLFile(file);
      
      const formData = new FormData();
      formData.append('xml', file);

      const response = await fetch('http://localhost:3000/api/entries/import-xml', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to import XML');
      }

      onSave();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process XML file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Cadastro de Entrada</h2>
            <p className="text-gray-500">Importe um arquivo XML de nota fiscal</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="border-2 border-dashed rounded-lg p-8">
          {xmlFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">{xmlFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(xmlFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setXMLFile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept=".xml"
                onChange={handleFileUpload}
                className="hidden"
                id="xml-upload"
              />
              <label
                htmlFor="xml-upload"
                className="flex flex-col items-center gap-3 cursor-pointer"
              >
                <div className="p-3 bg-gray-50 rounded-full">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Clique para fazer upload</p>
                  <p className="text-sm text-gray-500">ou arraste e solte o arquivo XML</p>
                </div>
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (xmlFile) {
                handleFileUpload({ target: { files: [xmlFile] } } as any);
              }
            }}
            disabled={!xmlFile || loading}
            className={`px-4 py-2 bg-green-600 text-white rounded-lg ${
              !xmlFile || loading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-green-700'
            }`}
          >
            {loading ? 'Processando...' : 'Importar XML'}
          </button>
        </div>
      </div>
    </div>
  );
}