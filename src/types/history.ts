export interface HistoryEntry {
  id: number;
  type: 'Entrada' | 'Produtos' | 'Saída';
  status: 'Adicionado' | 'Removido' | 'Modificado';
  item_id: string;
  category?: string;
  supplier_name?: string;
  product_name?: string;
  quantity?: number;
  unit_price?: number;
  created_at: string;
}