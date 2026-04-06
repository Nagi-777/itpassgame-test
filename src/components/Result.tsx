import type { QuizResult } from '../types';

interface ResultProps {
  result: QuizResult;
  onRetry: () => void;
  onHome: () => void;
}

export default function Result({ result, onRetry, onHome }: ResultProps) {
  const { score, total, chapterLabel } = result;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const grade = pct >= 80 ? { label: '合格圏', color: 'text-green-600', bg: 'bg-green-50 border-green-200' }
    : pct >= 60 ? { label: 'もう少し', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' }
    : { label: '要復習', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 max-w-lg mx-auto">
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        {/* チャプターラベル */}
        <p className="text-sm text-gray-400 mb-2">{chapterLabel}</p>

        {/* スコア */}
        <p className="text-sm font-medium text-gray-500 mb-1">結果</p>
        <div className="flex items-end justify-center gap-1 mb-1">
          <span className="text-xs text-gray-400">{total}点中</span>
          <span className="text-6xl font-black text-gray-800 leading-none">{score}</span>
          <span className="text-2xl font-bold text-gray-500 mb-1">点</span>
        </div>

        {/* 正答率 */}
        <p className="text-lg font-bold text-gray-500 mb-4">正答率 {pct}%</p>

        {/* グレード */}
        <div className={`inline-block px-5 py-2 rounded-full border font-black text-lg mb-6 ${grade.bg} ${grade.color}`}>
          {grade.label}
        </div>

        {/* 正答率バー */}
        <div className="w-full bg-gray-100 rounded-full h-3 mb-8 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-base transition-colors"
          >
            もう一度
          </button>
          <button
            onClick={onHome}
            className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-base transition-colors"
          >
            ホームへ
          </button>
        </div>
      </div>
    </div>
  );
}
