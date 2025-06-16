import { useState, useEffect } from "react";
import { Plus, Minus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TableData {
  headers: string[];
  rows: string[][];
}

interface TableEditorProps {
  initialData?: TableData;
  onSave: (tableData: TableData) => void;
  onCancel: () => void;
}

export function TableEditor({
  initialData,
  onSave,
  onCancel,
}: TableEditorProps) {
  const [headers, setHeaders] = useState<string[]>(
    initialData?.headers || ["Column 1", "Column 2", "Column 3"],
  );
  const [rows, setRows] = useState<string[][]>(
    initialData?.rows || [
      ["", "", ""],
      ["", "", ""],
    ],
  );

  const addColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`];
    const newRows = rows.map((row) => [...row, ""]);
    setHeaders(newHeaders);
    setRows(newRows);
  };

  const removeColumn = (index: number) => {
    if (headers.length <= 1) return;
    const newHeaders = headers.filter((_, i) => i !== index);
    const newRows = rows.map((row) => row.filter((_, i) => i !== index));
    setHeaders(newHeaders);
    setRows(newRows);
  };

  const addRow = () => {
    const newRow = new Array(headers.length).fill("");
    setRows([...rows, newRow]);
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    setHeaders(newHeaders);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
  };

  const handleSave = () => {
    onSave({ headers, rows });
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Table Editor</CardTitle>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">
              <Check className="h-4 w-4 mr-2" />
              Insert Table
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Controls */}
          <div className="flex gap-2 justify-end">
            <Button onClick={addColumn} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Column
            </Button>
            <Button onClick={addRow} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Headers */}
                <thead className="bg-muted">
                  <tr>
                    {headers.map((header, index) => (
                      <th
                        key={index}
                        className="relative p-2 border-r last:border-r-0"
                      >
                        <div className="flex items-center gap-2">
                          <Input
                            value={header}
                            onChange={(e) =>
                              updateHeader(index, e.target.value)
                            }
                            className="h-8 font-semibold text-center border-0 bg-transparent focus:bg-background"
                            placeholder={`Column ${index + 1}`}
                          />
                          {headers.length > 1 && (
                            <Button
                              onClick={() => removeColumn(index)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Rows */}
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t group">
                      {row.map((cell, colIndex) => (
                        <td
                          key={colIndex}
                          className="p-2 border-r last:border-r-0 relative"
                        >
                          <Input
                            value={cell}
                            onChange={(e) =>
                              updateCell(rowIndex, colIndex, e.target.value)
                            }
                            className="h-8 border-0 bg-transparent focus:bg-background"
                            placeholder="Enter data..."
                          />
                        </td>
                      ))}
                      {rows.length > 1 && (
                        <td className="p-2 w-10">
                          <Button
                            onClick={() => removeRow(rowIndex)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-50 hover:opacity-100"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p className="font-medium mb-1">Table Editor Instructions:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Click on header cells to rename columns</li>
              <li>Fill in data cells with your content</li>
              <li>Use + buttons to add more rows/columns</li>
              <li>Use - buttons to remove rows/columns (hover to see)</li>
              <li>Click "Insert Table" when done</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
