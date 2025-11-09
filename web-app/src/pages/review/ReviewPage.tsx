// 复习页面 - 核心功能
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { Modal } from '../../components/ui/Modal';
import { Countdown } from '../../components/ui/Countdown';
import { useNoteStore } from '../../store/note';
import { useTaskStore } from '../../store/task';
import { ReviewResult } from '../../types';
import { formatDate } from '../../utils/date';

export const ReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentNote, loading, fetchNoteById } = useNoteStore();
  const { submitReview } = useTaskStore();

  const [showSummary, setShowSummary] = useState(false);
  const [countdownComplete, setCountdownComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [nextReviewDate, setNextReviewDate] = useState('');
  const [reviewStartTime] = useState(Date.now());

  useEffect(() => {
    if (id) {
      loadNote(parseInt(id));
    }
  }, [id]);

  const loadNote = async (noteId: number) => {
    try {
      await fetchNoteById(noteId);
    } catch (error: any) {
      console.error('加载笔记失败:', error);
      alert('加载笔记失败: ' + error.message);
      navigate('/');
    }
  };

  const handleCountdownComplete = () => {
    setCountdownComplete(true);
  };

  const handleSubmitResult = async (result: ReviewResult) => {
    if (!currentNote) return;

    // 计算复习时长（秒）
    const reviewDurationSeconds = Math.floor((Date.now() - reviewStartTime) / 1000);

    setSubmitting(true);
    try {
      const response = await submitReview({
        noteId: currentNote.id,
        result,
        reviewDurationSeconds,
      });
      setNextReviewDate(response.nextReviewDate);
      setShowResultModal(true);
    } catch (error: any) {
      alert('提交失败: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
    navigate('/');
  };

  if (loading || !currentNote) {
    return (
      <Layout>
        <Loading fullScreen message="正在加载笔记..." />
      </Layout>
    );
  }

  // 是否需要倒计时（监督模式且倒计时未完成）
  const needCountdown = currentNote.isSupervised && !countdownComplete;
  const buttonsDisabled = needCountdown || submitting;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* 笔记标题和分类 */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{currentNote.title}</h1>
            {currentNote.categoryName && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium">
                {currentNote.categoryName}
              </span>
            )}
          </div>
          
          {/* 复习信息 */}
          {currentNote.currentReviewRecord && (
            <div className="text-sm text-gray-600">
              当前阶段: 第 {currentNote.currentReviewRecord.stageNumber} 次复习
            </div>
          )}
        </Card>

        {/* 监督机制倒计时 */}
        {currentNote.isSupervised && !countdownComplete && (
          <Countdown
            seconds={currentNote.supervisionDurationSeconds || 30}
            onComplete={handleCountdownComplete}
          />
        )}

        {/* 笔记内容 */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">笔记内容</h2>
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
            {currentNote.content}
          </div>
        </Card>

        {/* AI 总结（可展开/收起） */}
        {currentNote.aiSummary && (
          <Card className="mb-6">
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center">
                <Sparkles className="text-purple-600 mr-2" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">AI 总结</h2>
              </div>
              {showSummary ? (
                <ChevronUp className="text-gray-400" size={20} />
              ) : (
                <ChevronDown className="text-gray-400" size={20} />
              )}
            </button>
            
            {showSummary && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-gray-700 whitespace-pre-wrap">
                  {currentNote.aiSummary.summaryText}
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  生成时间: {formatDate(currentNote.aiSummary.createdAt)}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* 复习结果按钮 */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">复习结果</h2>
          
          {needCountdown && (
            <p className="text-sm text-orange-700 mb-4 text-center">
              ⏳ 请认真复习，倒计时结束后才能提交复习结果
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="success"
              size="lg"
              fullWidth
              onClick={() => handleSubmitResult('REMEMBERED')}
              disabled={buttonsDisabled}
              loading={submitting}
            >
              ✓ 记住了
            </Button>
            
            <Button
              variant="warning"
              size="lg"
              fullWidth
              onClick={() => handleSubmitResult('FUZZY')}
              disabled={buttonsDisabled}
              loading={submitting}
            >
              ~ 有点模糊
            </Button>
            
            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={() => handleSubmitResult('FORGOTTEN')}
              disabled={buttonsDisabled}
              loading={submitting}
            >
              ✗ 忘记了
            </Button>
          </div>

          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p>• <strong>记住了</strong>：完全记住内容，进入下一阶段</p>
            <p>• <strong>有点模糊</strong>：部分记住，重置到第一阶段</p>
            <p>• <strong>忘记了</strong>：完全忘记，重置到第一阶段</p>
          </div>
        </Card>
      </div>

      {/* 提交结果 Modal */}
      <Modal
        isOpen={showResultModal}
        onClose={handleCloseModal}
        title="复习完成"
      >
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">复习成功！</h3>
          <p className="text-gray-600 mb-6">
            下次复习时间: <span className="font-medium">{formatDate(nextReviewDate)}</span>
          </p>
          <Button onClick={handleCloseModal} fullWidth>
            知道了
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};
