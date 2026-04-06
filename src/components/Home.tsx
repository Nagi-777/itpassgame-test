import { useState } from 'react';
import type { QuizConfig, TestRecord } from '../types';
import questionsData from '../data/questions.json';

interface HomeProps {
  reviewCount: number;
  testHistory: TestRecord[];
  onStart: (config: QuizConfig) => void;
}

// 問題データから章一覧を動的生成
const allQuestions = questionsData.questions;
const chapters = Array.from(new Set(allQuestions.map(q => q.chapter))).sort();

export default function Home({ reviewCount, testHistory, onStart }: HomeProps) {
  const [selectedChapter, setSelectedChapter] = useState<string>('all');

  const chapterLabel = (ch: string) => ch === 'all' ? '全問' : `${ch}章`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-4 pt-8 pb-10 max-w-lg mx-auto">
      {/* タイトル */}
      <h1 className="text-xl font-black text-gray-800 mb-1 tracking-tight">
        IT パスポート 章別テスト
      </h1>
      <p className="text-xs text-gray-400 mb-6">ITパスポート試験対策 章別演習</p>

      {/* 章選択 */}
      <section className="mb-5">
        <p className="text-xs font-semibold text-gray-500 mb-2">章を選択</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedChapter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${
              selectedChapter === 'all'
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-white border-gray-200 text-gray-500'
            }`}
          >
            全問
          </button>
          {chapters.map(ch => (
            <button
              key={ch}
              onClick={() => setSelectedChapter(ch)}
              className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-colors ${
                selectedChapter === ch
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-gray-200 text-gray-500'
              }`}
            >
              {ch}章
            </button>
          ))}
        </div>
      </section>

      {/* アクションボタン */}
      <div className="flex flex-col gap-3 mb-8">
        <button
          onClick={() => onStart({ mode: 'chapter', chapter: selectedChapter })}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-base shadow-sm transition-colors"
        >
          テスト開始（{chapterLabel(selectedChapter)} · 10問）
        </button>
        <button
          onClick={() => onStart({ mode: 'review', chapter: 'all' })}
          disabled={reviewCount === 0}
          className={`w-full py-4 rounded-xl font-bold text-base shadow-sm transition-colors ${
            reviewCount > 0
              ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          復習する（{reviewCount}問）
        </button>
      </div>

      {/* 過去の結果 */}
      <section>
        <p className="text-xs font-semibold text-gray-500 mb-2">
          過去の結果
          {testHistory.length > 0 && (
            <span className="ml-1 text-gray-400 font-normal">（{testHistory.length}件）</span>
          )}
        </p>
        {testHistory.length === 0 ? (
          <div className="bg-white rounded-xl p-4 text-center text-sm text-gray-400 border border-gray-100">
            まだテストを受けていません
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {testHistory.map((rec, i) => (
              <div
                key={i}
                className="bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-gray-100 shadow-sm"
              >
                <div>
                  <span className="text-xs text-gray-400">{rec.date}</span>
                  <span className="ml-2 text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                    {rec.chapter}
                  </span>
                </div>
                <div className="text-sm font-black text-gray-800">
                  {rec.total}点中
                  <span className={`ml-1 text-lg ${rec.score >= rec.total * 0.8 ? 'text-green-600' : rec.score >= rec.total * 0.6 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {rec.score}点
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
