import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RotateCcw } from "lucide-react";

interface SourceOption {
  name: string;
  color: string;
  checked: boolean;
}

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sources: SourceOption[];
  onSourceToggle: (sourceName: string) => void;
  onReset: () => void;
  onSave: () => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  sources,
  onSourceToggle,
  onReset,
  onSave,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0">
        <DialogHeader className="p-6 pb-5 border-b border-border">
          <DialogTitle className="text-lg font-semibold">設定</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Source Selection Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              表示するソース
            </label>
            <div className="space-y-2">
              {sources.map((source) => (
                <label
                  key={source.name}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox
                    checked={source.checked}
                    onCheckedChange={() => onSourceToggle(source.name)}
                  />
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-sm text-foreground">{source.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-border flex justify-between">
          <Button
            variant="ghost"
            onClick={onReset}
            className="text-muted-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            設定をリセット
          </Button>
          <Button onClick={onSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
