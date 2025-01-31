export interface Entry {
  id: string;
  entry_date: string;
  supplier_cnpj: string;
  supplier_name: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  entry_code: string;
  status: string;
  origin: string;
  xml_path?: string;
  recipient_cnpj?: string;
  recipient_name?: string;
  note_number?: string;
  series?: string;
  entry_type?: string;
  access_key?: string;
  import_date?: string;
  emission_date?: string;
  authorization_protocol?: string;
  nfe_status?: string;
  created_at: string;
}