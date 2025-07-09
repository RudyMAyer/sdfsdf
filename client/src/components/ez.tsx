import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionsModal({ isOpen, onClose }: InstructionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Cara Bermain TTS Explorer
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Game Basics */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">🎯 Dasar Permainan</h4>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>• Selesaikan teka-teki silang dengan mengisi kotak jawaban</li>
              <li>• Gunakan petunjuk soal untuk menemukan jawaban yang benar</li>
              <li>• Dapatkan poin untuk setiap jawaban benar dan bonus jika menyelesaikan level dengan sempurna</li>
            </ul>
          </div>

          {/* Scoring System */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">⭐ Sistem Skor</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Jawaban Benar:</span>
                  <span className="font-medium text-green-600">+100 poin</span>
                </div>
                <div className="flex justify-between">
                  <span>Bonus Selesai Level:</span>
                  <span className="font-medium text-green-600">+300 poin</span>
                </div>
                <div className="flex justify-between">
                  <span>Bonus Sempurna (tanpa hint/salah):</span>
                  <span className="font-medium text-green-600">+1000 poin</span>
                </div>
                <div className="flex justify-between">
                  <span>Jawaban Salah:</span>
                  <span className="font-medium text-red-600">-50 poin</span>
                </div>
                <div className="flex justify-between">
                  <span>Gunakan Hint:</span>
                  <span className="font-medium text-amber-600">-50 poin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hint System */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">💡 Sistem Hint</h4>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li>• Anda mendapatkan 3 hint di setiap sesi permainan</li>
              <li>• Setiap soal hanya bisa diberi maksimal 2 hint</li>
              <li>• Jawaban salah akan otomatis membuka satu huruf acak</li>
              <li>• Menggunakan hint akan mengurangi 50 poin</li>
              <li>• Gunakan hint secara strategis agar skor tetap tinggi</li>
            </ul>
          </div>

          {/* Level Progression */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">🔓 Progress Level</h4>
            <div className="space-y-3 text-gray-700 text-base p-3 bg-gray-50 rounded-lg">
              Semua level dapat dimainkan kapan saja tanpa syarat skor apapun. Pilih level favoritmu dan mulai petualangan TTS!
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 px-6">
            Mengerti!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
