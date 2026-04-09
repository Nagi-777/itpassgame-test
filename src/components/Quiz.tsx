import { useState, useCallback } from 'react';
import type { Question, QuizConfig, QuizResult } from '../types';
import questionsData from '../data/questions.json';

interface QuizProps {
  config: QuizConfig;
  reviewQueue: string[];
  onFinish: (result: QuizResult) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CHOICE_LETTERS = ['A', 'B', 'C', 'D'] as const;

export default function Quiz({ config, reviewQueue, onFinish }: QuizProps) {
  const allQuestions = questionsData.questions as Question[];

  const [queue] = useState<Question[]>(() => {
    let pool: Question[];
    if (config.mode === 'review') {
      pool = allQuestions.filter(q => reviewQueue.includes(q.id));
    } else if (config.chapter === 'all') {
      pool = allQuestions;
    } else {
      pool = allQuestions.filter(q => q.chapter === config.chapter);
    }
    return shuffle(pool);
  });

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [showExit, setShowExit] = useState(false);

  const current = queue[index];
  const isAnswered = selected !== null;
  const isCorrect = selected === current?.answer;
  const isLast = index === queue.length - 1;

  const chapterLabel = config.mode === 'review'
    ? '復習'
    : config.chapter === 'all' ? '全問' : `${config.chapter}章`;

  const handleSelect = useCallback((letter: string) => {
    if (isAnswered || !current) return;
    setSelected(letter);
    if (letter === current.answer) {
      setScore(s => s + 1);
    } else {
      setWrongIds(prev => prev.includes(current.id) ? prev : [...prev, current.id]);
    }
  }, [isAnswered, current]);

  const handleNext = () => {
    if (isLast) {
      const finalScore = score + (isCorrect ? 0 : 0);
      // score is already updated via setScore before user can tap Next
      onFinish({
        score: finalScore,
        total: queue.length,
        chapterLabel,
        wrongIds,
      });
    } else {
      setIndex(i => i + 1);
      setSelected(null);
    }
  };

  const handleExitConfirm = () => {
    onFinish({ score, total: queue.length, chapterLabel, wrongIds });
  };

  if (queue.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <p className="text-gray-500 mb-4">出題できる問題がありません</p>
        <button
          onClick={() => onFinish({ score: 0, total: 0, chapterLabel, wrongIds: [] })}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold"
        >
          戻る
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-lg mx-auto">

      {/* 終了確認ダイアログ */}
      {showExit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-gray-800 mb-2">テストを終了しますか？</h3>
            <p className="text-sm text-gray-500 mb-5">現在の結果で記録されます。</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExit(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold"
              >
                続ける
              </button>
              <button
                onClick={handleExitConfirm}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold"
              >
                終了する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => setShowExit(true)}
          className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg font-medium"
        >
          終了する
        </button>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500 font-medium">
            {index + 1} <span className="text-gray-300">/</span> {queue.length}
          </span>
          <span className="font-black text-indigo-600">{score}点</span>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="bg-gray-100 h-1">
        <div
          className="bg-indigo-500 h-1 transition-all duration-300"
          style={{ width: `${((index + (isAnswered ? 1 : 0)) / queue.length) * 100}%` }}
        />
      </div>

      {/* 問題エリア */}
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-4">
        <div className="mb-3">
          <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
            {current.chapter}章
          </span>
        </div>

        {/* 問題文 */}
        <p className="text-base font-medium text-gray-800 leading-relaxed mb-5">
          {current.question}
        </p>

        {/* 選択肢ボタン */}
        <div className="flex flex-col gap-3 mb-5">
          {current.choices.map((choice) => {
            const letter = choice.charAt(0);
            let style = 'bg-white border-2 border-gray-200 text-gray-700';
            if (isAnswered) {
              if (letter === current.answer) {
                style = 'bg-green-50 border-2 border-green-500 text-green-800';
              } else if (letter === selected) {
                style = 'bg-red-50 border-2 border-red-400 text-red-700';
              } else {
                style = 'bg-white border-2 border-gray-100 text-gray-400';
              }
            } else if (selected === letter) {
              style = 'bg-indigo-50 border-2 border-indigo-500 text-indigo-800';
            }

            return (
              <button
                key={letter}
                onClick={() => handleSelect(letter)}
                disabled={isAnswered}
                className={`w-full px-4 py-4 rounded-xl text-left font-medium text-sm transition-colors shadow-sm ${style}`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {/* 回答後: 正解・不正解 + 解説 */}
        {isAnswered && (
          <div className="mb-5">
            {/* 正解/不正解バナー */}
            <div className={`rounded-xl px-4 py-3 mb-4 text-center font-black text-lg ${
              isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}>
              {isCorrect ? '✓ 正解！' : `✗ 不正解（正解: ${current.answer}）`}
            </div>

            {/* 解説 */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm">
              <p className="text-xs font-bold text-gray-400 mb-1">解説</p>
              <p className="text-sm text-gray-700 leading-relaxed">{current.explanation}</p>
            </div>

            {/* 用語解説 */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-400 mb-3">用語解説</p>
              <div className="flex flex-col gap-3">
                {CHOICE_LETTERS.map(letter => (
                  <div key={letter} className="flex gap-2">
                    <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      letter === current.answer
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {letter}
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed pt-0.5">
                      {current.termExplanations[letter]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 次へ / 結果を見る */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-base shadow-sm transition-colors"
          >
            {isLast ? '結果を見る →' : '次の問題 →'}
          </button>
        )}
      </div>
    </div>
  );
}
