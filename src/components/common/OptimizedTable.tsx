
import React, { memo, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface OptimizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowSelect?: (item: T) => void;
  selectedItems?: string[];
  onSelectAll?: (checked: boolean) => void;
  onItemSelect?: (id: string, checked: boolean) => void;
  getItemId: (item: T) => string;
  loading?: boolean;
}

/**
 * Tabela otimizada com memoização e identidade visual 99Tattoo
 */
export const OptimizedTable = memo(<T,>({ 
  data, 
  columns, 
  onRowSelect,
  selectedItems = [],
  onSelectAll,
  onItemSelect,
  getItemId,
  loading = false
}: OptimizedTableProps<T>) => {
  const allSelected = useMemo(() => 
    selectedItems.length === data.length && data.length > 0, 
    [selectedItems.length, data.length]
  );

  const TableRowMemo = memo(({ item, isSelected }: { item: T; isSelected: boolean }) => (
    <TableRow 
      className="hover:bg-red-50 transition-colors duration-200 group cursor-pointer"
      onClick={() => onRowSelect?.(item)}
    >
      {onItemSelect && (
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => 
              onItemSelect(getItemId(item), checked as boolean)
            }
          />
        </TableCell>
      )}
      {columns.map((column) => (
        <TableCell key={String(column.key)}>
          {column.render ? column.render(item) : String(item[column.key as keyof T] || '')}
        </TableCell>
      ))}
    </TableRow>
  ));

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-red-100 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-red-200 bg-gradient-to-br from-white to-red-50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-red-100 to-red-200">
            {onSelectAll && (
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead 
                key={String(column.key)} 
                className="text-red-800 font-black"
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const id = getItemId(item);
            const isSelected = selectedItems.includes(id);
            return (
              <TableRowMemo 
                key={id} 
                item={item} 
                isSelected={isSelected}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}) as <T>(props: OptimizedTableProps<T>) => JSX.Element;

OptimizedTable.displayName = 'OptimizedTable';

export default OptimizedTable;
