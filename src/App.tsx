import { useState, useCallback } from 'react';
import type { Screen, QuizConfig, QuizResult } from './types';
import { loadData, addHistory, addToReviewQueue, removeFromReviewQueue, todayStr } from './utils/storage';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Result from './components/Result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);

  // localStorageから最新データを取得（再レンダリングのトリガーとして使用）
  const [dataVersion, setDataVersion] = useState(0);
  const refresh = () => setDataVersion(v => v + 1);

  const data = loadData();

  const handleStart = useCallback((config: QuizConfig) => {
    setQuizConfig(config);
    setScreen('quiz');
  }, []);

  const handleFinish = useCallback((result: QuizResult) => {
    setLastResult(result);

    // 間違えた問題を復習キューに追加
    if (result.wrongIds.length > 0) {
      addToReviewQueue(result.wrongIds);
    }

    // テスト履歴に保存（復習モードは記録しない）
    if (quizConfig?.mode === 'chapter' && result.total > 0) {
      addHistory({
        date: todayStr(),
        chapter: result.chapterLabel,
        score: result.score,
        total: result.total,
      });
    }

    refresh();
    setScreen('result');
  }, [quizConfig]);

  // 復習モードで正解した問題を即座にキューから削除
  const handleCorrectAnswer = useCallback((id: string) => {
    removeFromReviewQueue([id]);
  }, []);

  const handleRetry = useCallback(() => {
    if (!quizConfig) return;
    setScreen('quiz');
  }, [quizConfig]);

  const handleHome = useCallback(() => {
    refresh();
    setScreen('home');
  }, []);

  if (screen === 'quiz' && quizConfig) {
    return (
      <Quiz
        config={quizConfig}
        reviewQueue={data.reviewQueue}
        onFinish={handleFinish}
        onCorrectAnswer={handleCorrectAnswer}
      />
    );
  }

  if (screen === 'result' && lastResult) {
    return (
      <Result
        result={lastResult}
        onRetry={handleRetry}
        onHome={handleHome}
      />
    );
  }

  return (
    <Home
      reviewCount={data.reviewQueue.length}
      testHistory={data.testHistory}
      onStart={handleStart}
    />
  );
}
