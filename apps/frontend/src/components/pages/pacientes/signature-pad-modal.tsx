import { useRef, useState } from "react";
import { X } from "lucide-react";

interface SignaturePadProps {
  onClose: () => void;
  onSave: (base64: string) => void;
}

export function SignaturePadModal({ onClose, onSave }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#8E7BBE"; // purple-400 equivalent or theme color
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";

    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Check if canvas is empty before saving
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-card border p-5 space-y-4 shadow-2xl" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <h4 className="font-bold text-sm text-foreground">Assinatura de Punho Digital</h4>
            <p className="text-[10px] text-muted-foreground">Desenhe a rubrica no painel com o mouse ou tela sensível.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground border-0 bg-transparent cursor-pointer">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="border bg-background rounded-xl overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
          <canvas
            ref={canvasRef}
            width={340}
            height={160}
            className="w-full bg-background block touch-none cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <div className="flex gap-2 justify-end text-xs">
          <button
            type="button"
            onClick={clearCanvas}
            className="px-4 py-2 border rounded-xl font-bold hover:bg-muted text-[10px] uppercase transition-colors cursor-pointer bg-transparent"
            style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={saveSignature}
            className="px-5 py-2 rounded-xl font-bold text-white gradient-primary shadow-lg border-0 cursor-pointer text-[10px] uppercase tracking-wider"
          >
            Confirmar Rubrica
          </button>
        </div>
      </div>
    </div>
  );
}
